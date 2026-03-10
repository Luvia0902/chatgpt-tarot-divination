from fastapi import HTTPException
from src.models import DivinationBody
from .base import DivinationFactory

SYS_PROMPT = "我請求你擔任中國傳統梅花易數占卜師的角色。" \
    "我會隨意說出兩個數字，第一個數字取為上卦，第二個數字取為下卦。" \
    "請你直接以數起卦，並向我解釋結果。"


class PlumFlowerFactory(DivinationFactory):

    divination_type = "plum_flower"

    def build_prompt(self, divination_body: DivinationBody) -> tuple[str, str]:
        if not divination_body.plum_flower:
            raise HTTPException(status_code=400, detail="No plum_flower")
        prompt = f"我选择的数字是: {divination_body.plum_flower.num1} 和 {divination_body.plum_flower.num2}"
        return prompt, SYS_PROMPT
