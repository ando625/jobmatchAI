# main.py
# FastAPIサーバーの「入口」。ここにAPIのエンドポイントを書く

from fastapi import FastAPI          # FastAPIの本体
from pydantic import BaseModel       # リクエストの「型チェック」をする道具
from matcher import calc_jaccard_score    # 自分で作ったJaccard計算を読み込む
from gemini import generate_match_reason, generate_match_reason_for_company  # 自分で作ったGemini連携を読み込む
from google import genai
from google.genai import types
from trend_analyzer import analyze_skill_trend




# 1. FastAPIアプリを作る（「お店をオープンします」という宣言）
app = FastAPI()

# 2. リクエストの「型」を定義する
#    Laravelからこのような形のJSONが送られてくる

# 求職者が「診断ボタン」を押した時用
class MatchRequest(BaseModel):
    user_skills: list[str]
    job_skills: list[str]
    user_intro: str = ""
    job_description: str = ""
    

# 企業側が応募書分析する時
class CompanyMatchRequest(BaseModel):
    user_skills: list[str]   # 例: ["PHP", "Laravel", "React"]
    job_skills: list[str]    # 例: ["PHP", "Laravel", "MySQL"]
    user_intro: str = ""
    score: int
    job_description: str = ""



# トレンド分析用の「リスクエストの形」を決める
# laravelから「なんのスキルを調べたいか」を受け取るための箱
class TrendRequest(BaseModel):
    skill_name: str



# 3. エンドポイントを作る
#    「POST /match に来たら、この関数を実行してね」という意味
@app.post("/match")
async def match(req: MatchRequest):
    # 4. Jaccard係数でスコアを計算する
    score = calc_jaccard_score(req.user_skills, req.job_skills)
    
    # 5. Geminiで理由文を生成する
    reason = generate_match_reason(req.user_skills, req.job_skills, score, req.user_intro, req.job_description, )
    
    # 6. LaravelにJSONで返す
    #    例: {"score": 67, "reason": "PHPとLaravelの経験が..."}
    return {"score": score, "reason": reason}

# 企業用
@app.post("/match/company")
async def match_company(req: CompanyMatchRequest):
    # すでに計算済みのスコアを使って、企業向けの理由文だけを生成する
    reason = generate_match_reason_for_company(
        req.user_skills, 
        req.job_skills, 
        req.score, 
        req.user_intro,
        req.job_description, 
    )
    return {"reason": reason}



# 追加「トレンド分析窓口」
@app.post("/analyze-trend")
async def analyze_trend(req: TrendRequest):
    analysis_result = analyze_skill_trend(req.skill_name)
    
    return {"analysis": analysis_result}


# 7. サーバーが起動したとき「生きてるよ！」確認用のエンドポイント
@app.get("/health")
async def health():
    return {"status": "ok"}