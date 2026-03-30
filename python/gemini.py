# gemini.py
# GeminiAIに「なぜマッチしているか」の理由文を作ってもらうファイル

import os                         # 環境変数を読み込むための道具
import google.generativeai as genai  # Gemini APIを使うための道具


# 「スキル情報をAIに渡して、マッチ理由を文章で作らせる関数」
def generate_match_reason(
    user_skills: list[str],   # 求職者のスキル例: ["PHP","Laravel","React"]
    job_skills: list[str],    # 求人に必要なスキル例: ["PHP","Laravel","MySQL"]
    score: int                # Jaccard係数で出したスコア例: 67
) -> str:
    # 1. 環境変数からGeminiのAPIキーを取得する
    #    (コードにAPIキーを直接書くと危険なので、環境変数に隠す)
    api_key = os.getenv("GEMINI_API_KEY", "")
    
    # 2. APIキーが空っぽなら、デフォルトのメッセージを返す
    if not api_key:
        return "AIによる分析を利用できません。"
    
    # 3. Geminiの設定をする（「APIキーを使ってGeminiに接続して」という命令）
    genai.configure(api_key=api_key)
    
    # 4. 使うモデルを指定する
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    # 5. Geminiに送るプロント（質問文）を作る
    prompt = f"""
以下の情報をもとに、求職者がこの求人にマッチしている理由を日本語200文字以内で説明してください。

求職者のスキル: {",".join(user_skills)}
求人の必須スキル: {",".join(job_skills)}
マッチスコア: {score}点

・箇条書きにしないで、自然な文章で書いてください。
・「この求人では〜」という形式で書き始めてください。
"""
    # 6. Geminiにプロントを送って、レスポンスを受け取る
    response = model.generate_content(prompt)
    
    # 7. レスポンスからテキストだけ取り出して返す
    return response.text.strip()