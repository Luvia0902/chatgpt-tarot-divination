import random
from src.models import DivinationBody
from .base import DivinationFactory

# 44 張獨角獸療癒牌卡（含牌名、牌義與指引語）
UN_CARDS = [
    {
        "id": 1,
        "name": "你的個人獨角獸",
        "image": "1.jpg",
        "meaning": "沐浴在純靜的愛之中，保持開放，迎接獨角獸魔法。",
    },
    {
        "id": 2,
        "name": "純淨的意圖",
        "image": "2.jpg",
        "meaning": "找到清明，放棄你的小我。",
    },
    {
        "id": 3,
        "name": "創造你的願景",
        "image": "3.jpg",
        "meaning": "做會讓你的心歌唱之事，你被輕推著向前行。",
    },
    {
        "id": 4,
        "name": "解放關係的羈絆",
        "image": "4.jpg",
        "meaning": "現在就是放下，寬恕就是自由。",
    },
    {
        "id": 5,
        "name": "新的契機",
        "image": "5.jpg",
        "meaning": "清理你的人生，瞥見一扇魔法之門。",
    },
    {
        "id": 6,
        "name": "進入魔法",
        "image": "6.jpg",
        "meaning": "活在現在，抓住當下。",
    },
    {
        "id": 7,
        "name": "聆聽你的心",
        "image": "7.jpg",
        "meaning": "喚醒心靈能力，調頻進入無限。",
    },
    {
        "id": 8,
        "name": "樂於接受豐盛",
        "image": "8.jpg",
        "meaning": "相信你值得，接受豐富與繁榮。",
    },
    {
        "id": 9,
        "name": "敞開你的心",
        "image": "9.jpg",
        "meaning": "愛自己，敢於脆弱易感。",
    },
    {
        "id": 10,
        "name": "取用你的天賦",
        "image": "10.jpg",
        "meaning": "探索你的寶箱，接納你的真實本性。",
    },
    {
        "id": 11,
        "name": "尋找徵兆",
        "image": "11.jpg",
        "meaning": "好好注意，期待答案。",
    },
    {
        "id": 12,
        "name": "真理的自由",
        "image": "12.jpg",
        "meaning": "誠實地溝通，做真正的自己。",
    },
    {
        "id": 13,
        "name": "創意性的解決方案",
        "image": "13.jpg",
        "meaning": "打破常規思考，從更高的視角看待事物。",
    },
    {
        "id": 14,
        "name": "靠自己的力量站穩",
        "image": "14.jpg",
        "meaning": "對你的願景滿懷熱情，帶來正向的改變。",
    },
    {
        "id": 15,
        "name": "宇宙彩虹",
        "image": "15.jpg",
        "meaning": "尋找那罐金子，接受喜悅。",
    },
    {
        "id": 16,
        "name": "靈魂療癒",
        "image": "16.jpg",
        "meaning": "與你的本質連成一氣，看見你的真實色彩。",
    },
    {
        "id": 17,
        "name": "順流而行",
        "image": "17.jpg",
        "meaning": "放鬆並信任，接受正在發生的事。",
    },
    {
        "id": 18,
        "name": "令人煥然一新的綠洲",
        "image": "18.jpg",
        "meaning": "滋養你自己，累積力氣。",
    },
    {
        "id": 19,
        "name": "白光之繭",
        "image": "19.jpg",
        "meaning": "在完美的愛中休息，了解「一」。",
    },
    {
        "id": 20,
        "name": "玫瑰金宇宙池",
        "image": "20.jpg",
        "meaning": "沐浴在宇宙的愛之中，好好吸收智慧。",
    },
    {
        "id": 21,
        "name": "魔法水晶洞穴",
        "image": "21.jpg",
        "meaning": "開啟你的內在之光，展現你的天賦。",
    },
    {
        "id": 22,
        "name": "顯化你的夢想",
        "image": "22.jpg",
        "meaning": "聚焦在你的願景，尋求滿意和知足感。",
    },
    {
        "id": 23,
        "name": "靈魂的滿足",
        "image": "23.jpg",
        "meaning": "向你的獨一無二致敬，做讓你感覺美好的事。",
    },
    {
        "id": 24,
        "name": "大量的祝福",
        "image": "24.jpg",
        "meaning": "敞開自己，好好接收，將它傳出去。",
    },
    {
        "id": 25,
        "name": "充滿關愛的社群",
        "image": "25.jpg",
        "meaning": "參與且成為其中的一分子，豐富你的人生。",
    },
    {
        "id": 26,
        "name": "紫色火焰",
        "image": "26.jpg",
        "meaning": "祈請宇宙鑽石紫色火焰，轉變不是愛的一切。",
    },
    {
        "id": 27,
        "name": "揚昇火焰",
        "image": "27.jpg",
        "meaning": "與光融合，點燃密鑰與密碼。",
    },
    {
        "id": 28,
        "name": "基督之光池",
        "image": "28.jpg",
        "meaning": "敞開你的心，散播無條件的愛。",
    },
    {
        "id": 29,
        "name": "聖雄能量",
        "image": "29.jpg",
        "meaning": "建立你的光體，使你的揚昇加速。",
    },
    {
        "id": 30,
        "name": "宇宙鑽石",
        "image": "30.jpg",
        "meaning": "散播希望和喜悅，照亮世界。",
    },
    {
        "id": 31,
        "name": "宇宙祖母綠",
        "image": "31.jpg",
        "meaning": "創造完美的健康，取用神性豐盛。",
    },
    {
        "id": 32,
        "name": "宇宙紅寶石",
        "image": "32.jpg",
        "meaning": "成為和平大使，實踐宇宙級的精通。",
    },
    {
        "id": 33,
        "name": "宇宙藍寶石",
        "image": "33.jpg",
        "meaning": "以榮譽和誠信行動，說出你的真理。",
    },
    {
        "id": 34,
        "name": "宇宙珍珠",
        "image": "34.jpg",
        "meaning": "擴展你的心靈天賦，打開通往天使界的大門。",
    },
    {
        "id": 35,
        "name": "神性潛能",
        "image": "35.jpg",
        "meaning": "履行你的天命，成為你所能成為的一切。",
    },
    {
        "id": 36,
        "name": "成為指路明燈",
        "image": "36.jpg",
        "meaning": "啟發他人，為他人照亮道路。",
    },
    {
        "id": 37,
        "name": "靈性戰士",
        "image": "37.jpg",
        "meaning": "向他人展現你是個睿智的領袖，指揮宇宙。",
    },
    {
        "id": 38,
        "name": "獨角獸能量之門",
        "image": "38.jpg",
        "meaning": "集中你的光，仔細聆聽訊息。",
    },
    {
        "id": 39,
        "name": "揚昇電梯",
        "image": "39.jpg",
        "meaning": "為快速的靈性成長做好準備，準備好迎接種種機會。",
    },
    {
        "id": 40,
        "name": "天琴座星際之門",
        "image": "40.jpg",
        "meaning": "擴展你的業力輪，進入獨角獸王國。",
    },
    {
        "id": 41,
        "name": "恩典法則",
        "image": "41.jpg",
        "meaning": "成為你的神性本質，在恩典中消融一切。",
    },
    {
        "id": 42,
        "name": "合而為「一」",
        "image": "42.jpg",
        "meaning": "尋找共同的人性，祈請列本里亞之光。",
    },
    {
        "id": 43,
        "name": "覺醒",
        "image": "43.jpg",
        "meaning": "從更高的視角觀看，看見每一個人內在的神性。",
    },
    {
        "id": 44,
        "name": "我是臨在",
        "image": "44.jpg",
        "meaning": "擴展你的星系門戶，如我所是。",
    },
]

UNICORN_CARDS = UN_CARDS


UNICORN_SYS_PROMPT = (
    "你是一位充滿愛與智慧的獨角獸療癒諮商師。"
    "使用者已經從神聖的獨角獸療癒卡牌中抽取了一張牌，"
    "你將根據這張牌的名稱與牌義，結合使用者的問題，"
    "給予溫暖、鼓勵、充滿療癒能量的個人化解讀。"
    "請以第二人稱（你）親切地與使用者說話，語氣溫暖如光，充滿愛與希望。"
    "解讀時請：\n"
    "1) 先呼應牌義的核心訊息，2) 針對使用者的問題給出具體的洞察，\n"
    "3) 最後給予一個實際可行的小行動建議或肯定語。\n"
    "整體語氣應充滿靈性的溫暖，但不過於神秘難懂。長度控制在 250～400 字左右。"
)


class UnicornFactory(DivinationFactory):

    divination_type = "unicorn"

    def build_prompt(self, divination_body: DivinationBody) -> tuple[str, str]:
        # 從前端傳來 prompt，格式為：「問題｜牌名｜牌義」
        # 如果前端沒有傳牌卡資訊，後端隨機抽一張
        raw = divination_body.prompt or ""
        parts = raw.split("｜")

        if len(parts) >= 4:
            question = parts[0].strip()
            card_name = parts[1].strip()
            card_meaning = parts[2].strip()
            card_image = parts[3].strip()
        elif len(parts) >= 3:
            question = parts[0].strip()
            card_name = parts[1].strip()
            card_meaning = parts[2].strip()
            # 尋找對應圖片，若找不到則隨機
            match = next((c for c in UNICORN_CARDS if c['name'] == card_name), None)
            card_image = match['image'] if match else "1.jpg"
        else:
            # fallback：後端隨機抽牌
            card = random.choice(UNICORN_CARDS)
            card_name = card["name"]
            card_meaning = card["meaning"]
            card_image = card["image"]
            question = raw.strip() or "我此刻需要什麼指引？"

        user_prompt = (
            f"使用者的問題：{question}\n"
            f"抽到的牌：【{card_name}】\n"
            f"牌義：{card_meaning}\n\n"
            f"請根據以上資訊，給予溫暖、鼓勵、充滿療癒能量的個人化解讀。"
        )
        return user_prompt, UNICORN_SYS_PROMPT
