from fastapi import HTTPException
from src.models import DivinationBody
from .base import DivinationFactory

TAROT_PROMPT = "我請求你擔任塔羅占卜師的角色。" \
    "您將接受我的問題並使用虛擬塔羅牌進行塔羅牌閱讀。" \
    "不要忘記洗牌並介紹您在本套牌中使用的牌組。" \
    "請幫我抽 3 張隨機卡片。" \
    "拿到卡片後，請您仔細說明它們的意義，" \
    "解釋哪張卡片屬於未來、現在或過去，結合我的問題來解釋它們，" \
    "並給我實用的建議或我現在應該做的事情。\n" \
    "請確保您的回答是完整且詳盡的，不要中途斷掉，至少提供 600～1000 字的深度解析。"


class TarotFactory(DivinationFactory):

    divination_type = "tarot"

    def build_prompt(self, divination_body: DivinationBody) -> tuple[str, str]:
        if len(divination_body.prompt) > 40:
            raise HTTPException(status_code=400, detail="Prompt too long")
        return divination_body.prompt, TAROT_PROMPT
