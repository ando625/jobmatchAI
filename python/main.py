# main.py
# FastAPIサーバーの「入口」。ここにAPIのエンドポイントを書く

from fastapi import FastAPI          # FastAPIの本体
from pydantic import BaseModel       # リクエストの「型チェック」をする道具
from matcher import calc_jaccard_score    # 自分で作ったJaccard計算を読み込む
from gemini import generate_match_reason  # 自分で作ったGemini連携を読み込む

# 1. FastAPIアプリを作る（「お店をオープンします」という宣言）
app = FastAPI()

# 2. リクエストの「型」を定義する
#    Laravelからこのような形のJSONが送られてくる
class MatchRequest(BaseModel):
    user_skills: list[str]   # 例: ["PHP", "Laravel", "React"]
    job_skills: list[str]    # 例: ["PHP", "Laravel", "MySQL"]

# 3. エンドポイントを作る
#    「POST /match に来たら、この関数を実行してね」という意味
@app.post("/match")
async def match(req: MatchRequest):
    # 4. Jaccard係数でスコアを計算する
    score = calc_jaccard_score(req.user_skills, req.job_skills)
    
    # 5. Geminiで理由文を生成する
    reason = generate_match_reason(req.user_skills, req.job_skills, score)
    
    # 6. LaravelにJSONで返す
    #    例: {"score": 67, "reason": "PHPとLaravelの経験が..."}
    return {"score": score, "reason": reason}

# 7. サーバーが起動したとき「生きてるよ！」確認用のエンドポイント
@app.get("/health")
async def health():
    return {"status": "ok"}