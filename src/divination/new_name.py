import datetime
from fastapi import HTTPException
from src.models import DivinationBody
from .base import DivinationFactory

NEW_NAME_PROMPT = (
    "我請求你擔任起名師的角色，"
    "我將會提供我的姓氏、生日、性別等，"
    "請返回你認為最適合我的名字，"
    "請注意姓氏在前，名字在後。"
)


class NewNameFactory(DivinationFactory):

    divination_type = "new_name"

    def build_prompt(self, divination_body: DivinationBody) -> tuple[str, str]:
        if (not divination_body.new_name or not all([
            divination_body.new_name.surname,
            divination_body.new_name.birthday,
            divination_body.new_name.sex,
        ]) or len(divination_body.new_name.new_name_prompt) > 20):
            raise HTTPException(status_code=400, detail="起名参数错误")

        birthday = datetime.datetime.strptime(
            divination_body.birthday, '%Y-%m-%d %H:%M:%S'
        )
        prompt = (
            f"姓氏是{divination_body.new_name.surname},"
            f"生日是{birthday.year}年{birthday.month}月{birthday.day}日{birthday.hour}时{birthday.minute}分{birthday.second}秒"
        )
        if divination_body.new_name.new_name_prompt:
            prompt += f",我的要求是: {divination_body.new_name.new_name_prompt}"
        return prompt, NEW_NAME_PROMPT
