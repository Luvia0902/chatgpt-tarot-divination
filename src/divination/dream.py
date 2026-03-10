from fastapi import HTTPException
from src.models import DivinationBody
from .base import DivinationFactory

DREAM_PROMPT = "我請求你擔任中國傳統周公解夢師的角色。" \
    "我將會提供我的夢境，請你解釋我的夢境，" \
    "並為其提供相應的指導和建議。"


class DreamFactory(DivinationFactory):

    divination_type = "dream"

    def build_prompt(self, divination_body: DivinationBody) -> tuple[str, str]:
        if len(divination_body.prompt) > 40:
            raise HTTPException(status_code=400, detail="Prompt too long")
        prompt = f"我的梦境是: {divination_body.prompt}"
        return prompt, DREAM_PROMPT
