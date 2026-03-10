# AI 占卜 - ChatGPT Tarot Divination

基於 ChatGPT 的 AI 算命、占卜應用程式，支援多種占卜方式，提供串流輸出體驗與歷史紀錄管理。

![demo](assets/demo.png)

## 功能列表

- [x] **塔羅牌占卜** - 透過塔羅牌探索內心，洞察未來可能性
- [x] **獨角獸療癒牌卡** - 以充滿愛與智慧的獨角獸能量給予溫暖指引
- [x] **生辰八字** - 根據出生時間分析命理運勢
- [x] **姓名五格** - 透過姓名筆畫分析性格和命運
- [x] **周公解夢** - 解析夢境含義，探索潛意識
- [x] **命名取名** - 根據生辰八字和五行推薦吉祥名字
- [x] **梅花易數** - 傳統易學占卜方法
- [x] **姻緣占卜** - 分析感情運勢和姻緣走向 [@alongLFB](https://github.com/alongLFB)

**特色功能**：
- 🌊 串流輸出 - AI 占卜結果以打字機效果即時呈現
- 📚 歷史紀錄 - 每種占卜類型自動儲存最近 10 筆紀錄
- 📱 響應式設計 - 完美相容手機、平板、電腦
- 🌙 深色模式 - 支援淺色/深色主題切換

---

## 四種部署方式

### 方式一：Vercel 一鍵部署（推薦）⭐

最簡單快捷的部署方式，無需伺服器，完全免費。

1. 點擊下方按鈕開始部署：

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLuvia0902%2Fchatgpt-tarot-divination&env=api_key,api_base&project-name=ai-divination&repository-name=ai-divination&demo-title=AI%20Divination&demo-description=AI%20Divination)

2. 在部署時設定環境變數：
   - `api_key`：必填，你的 OpenAI API Key
   - `api_base`：選填，API 網址（預設為 OpenAI 官方網址）
   - 其他選填參數：`model`、`github_client_id`、`github_client_secret` 等

3. 部署完成後，Vercel 會自動分配一個專屬網域

4. 也可以自行綁定個人網域

### 方式二：下載 EXE 安裝檔（Windows 使用者）

1. [點擊下載 EXE 安裝檔](https://github.com/Luvia0902/chatgpt-tarot-divination/releases/tag/latest)
2. 安裝並執行程式
3. 在設定中配置：
   - API BASE URL（OpenAI API 網址）
   - API KEY（你的 API 金鑰）
4. 返回首頁即可開始使用

### 方式三：Docker 部署

建立 `docker-compose.yml` 檔案：

```yaml
services:
  chatgpt-tarot-divination:
    image: ghcr.io/Luvia0902/chatgpt-tarot-divination:latest
    container_name: chatgpt-tarot-divination
    restart: always
    ports:
      - 8000:8000
    environment:
      - api_key=sk-xxx                       # 必填：OpenAI API Key
      # - api_base=https://api.openai.com/v1 # 選填：API 網址
      # - model=gpt-3.5-turbo                # 選填：模型名稱
      # - rate_limit=10/minute               # 選填：速率限制
      # - user_rate_limit=600/hour           # 選填：使用者速率限制
      - github_client_id=xxx                 # 選填：GitHub OAuth
      - github_client_secret=xxx             # 選填：GitHub OAuth
      - jwt_secret=secret                    # 選填：JWT 金鑰
      - ad_client=ca-pub-xxx                 # 選填：廣告客戶端
      - ad_slot=123                          # 選填：廣告版位
```

啟動服務：

```bash
docker-compose up -d
```

瀏覽 `http://localhost:8000` 即可使用。

### 方式四：本機執行（開發者）

**前置需求**：
- Node.js 16+
- Python 3.8+
- pnpm

**步驟**：

1. **建立設定檔** - 在專案根目錄建立 `.env` 檔案：

```bash
api_key=sk-xxxx                         # 必填：OpenAI API Key
api_base=https://api.openai.com/v1      # 選填：API 網址
github_client_id=xxx                    # 選填：GitHub OAuth
github_client_secret=xxx                # 選填：GitHub OAuth
ad_client=ca-pub-xxx                    # 選填：廣告客戶端
ad_slot=123                             # 選填：廣告版位
```

2. **建置前端**：

```pwsh
cd frontend
pnpm install
pnpm build --emptyOutDir
cd ..
```

3. **部署前端檔案**：

```pwsh
# 支援 Windows PowerShell (pwsh 7+) 與一般 bash 環境的不同寫法

# Windows PowerShell:
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path dist | Out-Null
Copy-Item -Path "frontend/dist/*" -Destination "dist" -Recurse

# Linux / macOS (Bash):
# rm -rf dist
# cp -r frontend/dist/ dist
```

4. **安裝並啟動後端** (Windows PowerShell 環境)：

```pwsh
python -m venv ./venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

5. **瀏覽應用程式** - 打開瀏覽器瀏覽 `http://localhost:8000`

---

## License

MIT License
