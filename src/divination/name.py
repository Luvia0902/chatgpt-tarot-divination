from fastapi import HTTPException
from src.models import DivinationBody
from .base import DivinationFactory

NAME_PROMPT = "我請求你擔任中國傳統姓名五格算命師的角色。" \
    "我將會提供我的名字，請你根據我的名字推算，" \
    "分析姓氏格、名字格、和自己格。" \
    "並為其提供相應的指導和建議。"


class NameFactory(DivinationFactory):

    divination_type = "name"

    def build_prompt(self, divination_body: DivinationBody) -> tuple[str, str]:
        if len(divination_body.prompt) > 10 or len(divination_body.prompt) < 1:
            raise HTTPException(status_code=400, detail="姓名長度錯誤")
        prompt = f"我的名字是{divination_body.prompt}"
        return prompt, NAME_PROMPT
