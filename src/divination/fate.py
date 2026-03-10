from fastapi import HTTPException
from src.models import DivinationBody
from .base import DivinationFactory

SYS_PROMPT = "你是一個姻緣助手，我給你發兩個人的名字，用逗號隔開，"\
    "你來隨機說一下，這兩個人之間的緣分如何？"\
    "不需要很真實，只需要娛樂化地說一下即可。"\
    "你可以根據人名先判斷一下這個名字的真實性，"\
    "如果輸入是一些類似張三李四之類的，就返回「不合適」，"\
    "或者如果兩個人的名字性別都是同性，也最好返回「不合適」。"\
    "然後基本主要圍繞：90% 的機率說二人很合適，然後 10% 的機率說對方不合適，並列出為何如此的原因。"


class Fate(DivinationFactory):

    divination_type = "fate"

    def build_prompt(self, divination_body: DivinationBody) -> tuple[str, str]:
        fate = divination_body.fate
        if not fate:
            raise HTTPException(status_code=400, detail="Fate is required")
        if len(fate.name1) > 40 or len(fate.name2) > 40:
            raise HTTPException(status_code=400, detail="Prompt too long")
        prompt = f'{fate.name1}, {fate.name2}'
        return prompt, SYS_PROMPT
