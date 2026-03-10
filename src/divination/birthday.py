import datetime
from src.models import DivinationBody
from .base import DivinationFactory

BIRTHDAY_PROMPT = "我請求你擔任中國傳統生辰八字算命師的角色。" \
    "我將會提供我的生日，請你根據我的生日推算命盤，" \
    "分析五行屬性、吉凶禍福、財運、婚姻、健康、事業等方面的情況，" \
    "並為其提供相應的指導和建議。"


class BirthdayFactory(DivinationFactory):

    divination_type = "birthday"

    def build_prompt(self, divination_body: DivinationBody) -> tuple[str, str]:
        return self.internal_build_prompt(divination_body.birthday)

    def internal_build_prompt(self, birthday: str) -> tuple[str, str]:
        birthday = datetime.datetime.strptime(
            birthday, '%Y-%m-%d %H:%M:%S'
        )
        prompt = f"我的生日是{birthday.year}年{birthday.month}月{birthday.day}日{birthday.hour}时{birthday.minute}分{birthday.second}秒"
        return prompt, BIRTHDAY_PROMPT
