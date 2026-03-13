import json
import os
import logging
from typing import Optional, AsyncGenerator

from fastapi import Depends, HTTPException, Request, status, APIRouter
from fastapi.responses import StreamingResponse
import google.generativeai as genai

from src.config import settings
from src.models import DivinationBody, User
from src.user import get_user
from src.limiter import get_real_ipaddr, check_rate_limit
from src.divination import DivinationFactory

router = APIRouter()
_logger = logging.getLogger(__name__)

STOP_WORDS = [
    "忽略", "ignore", "指令", "命令", "command", "help", "之前",
    "遵守", "遵循"
]

@router.post("/api/divination")
async def divination(
    request: Request,
    divination_body: DivinationBody,
    user: Optional[User] = Depends(get_user)
):
    real_ip = get_real_ipaddr(request)
    
    # Rate limit check
    if settings.enable_rate_limit:
        if not user:
            max_reqs, time_window_seconds = settings.rate_limit
            check_rate_limit(f"{settings.project_name}:{real_ip}", time_window_seconds, max_reqs)
        else:
            max_reqs, time_window_seconds = settings.user_rate_limit
            check_rate_limit(
                f"{settings.project_name}:{user.login_type}:{user.user_name}", time_window_seconds, max_reqs
            )

    _logger.info(
        f"Request from {real_ip}, type={divination_body.prompt_type}"
    )

    if any(w in divination_body.prompt.lower() for w in STOP_WORDS):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Prompt contains stop words"
        )

    divination_obj = DivinationFactory.get(divination_body.prompt_type)
    if not divination_obj:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Prompt type {divination_body.prompt_type} not supported"
        )
    
    prompt, system_prompt = divination_obj.build_prompt(divination_body)

    # API configuration
    custom_api_key = request.headers.get("x-api-key") or settings.api_key
    
    if not custom_api_key or custom_api_key.startswith("sk-dummy"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="請在管理介面或 .env 中配置正確的 Google API Key"
        )

    try:
        # Configure Gemini
        genai.configure(api_key=custom_api_key)
        
        # Use configured model as fallback
        model_name = request.headers.get("x-api-model") or settings.model
        # Auto-correct legacy or unavailable model names
        if any(x in model_name for x in ["gpt-", "gemini-1.5", "gemini-2.0-flash"]):
            model_name = "gemini-2.5-flash"
            
        model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction=system_prompt
        )

        async def get_gemini_generator():
            try:
                # generate_content_async supports streaming
                response = await model.generate_content_async(
                    prompt,
                    generation_config=genai.types.GenerationConfig(
                        max_output_tokens=8192,
                        temperature=0.9,
                    ),
                    stream=True
                )
                async for chunk in response:
                    try:
                        # Safety checks: if blocked, the chunk might have no candidates or text
                        if hasattr(chunk, 'candidates') and chunk.candidates:
                            candidate = chunk.candidates[0]
                            if candidate.finish_reason and candidate.finish_reason.value != 1: # 1 is STOP (Normal)
                                _logger.warning(f"Gemini stopped early. Finish reason: {candidate.finish_reason}")
                                if candidate.finish_reason.value == 3: # SAFETY
                                    yield f"data: {json.dumps('\n\n> ⚠️ **部分內容觸發安全過濾而被隱藏**')}\n\n"

                        if hasattr(chunk, 'text') and chunk.text:
                            yield f"data: {json.dumps(chunk.text)}\n\n"
                    except (ValueError, AttributeError) as inner_e:
                        _logger.debug(f"Chunk processing skipped: {inner_e}")
                        continue
            except Exception as e:
                _logger.error(f"Streaming error: {e}")
                # Yield a plain string to avoid [object Object] on frontend
                error_msg = f"\n\n> ⚠️ **占卜連線中斷**: {str(e)}"
                yield f"data: {json.dumps(error_msg)}\n\n"

        return StreamingResponse(get_gemini_generator(), media_type='text/event-stream')

    except Exception as e:
        _logger.error(f"Gemini API error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gemini API error: {str(e)}"
        )
