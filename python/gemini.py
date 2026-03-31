# gemini.py
# GeminiAIに「なぜマッチしているか」の理由文を作ってもらうファイル

import os                         # 環境変数を読み込むための道具
import google.generativeai as genai  # Gemini APIを使うための道具


# 「スキル情報をAIに渡して、マッチ理由を文章で作らせる関数」
def generate_match_reason(
    user_skills: list[str],   # 求職者のスキル例: ["PHP","Laravel","React"]
    job_skills: list[str],    # 求人に必要なスキル例: ["PHP","Laravel","MySQL"]
    score: int,                # Jaccard係数で出したスコア例: 67
    user_intro: str           # ユーザーの自己紹介文
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
    
    # 自己紹介があるかないかで、Geminiへの頼み方を変える
    if not user_intro or user_intro.strip() == "":
        # 自己紹介がない場合
        intro_section = "・自己紹介: （未入力のため、スキル情報のみで分析してください）"
        additional_instruction = "自己紹介が未入力なので、提供されたスキル情報のみに焦点を当てて分析を開始してください。"
    else:
        # 自己紹介がある場合
        intro_section = f"・自己紹介: {user_intro}"
        additional_instruction = "スキルの整合性に加え、自己紹介から読み取れる経験や志向性も加味して分析してください。"
    
    # 5. Geminiに送るプロント（質問文）を作る
    prompt = f"""
あなたは、プログラミング初心者に寄り添う、誠実でわかりやすいキャリアアドバイザーです。
以下のデータをもとに、求職者への「AIマッチ診断アドバイス」を作成してください。

【データ】
・求職者のスキル: {",".join(user_skills)}
{intro_section}
・求人の必須スキル: {",".join(job_skills)}
・計算された適合度スコア: {score}点（100点満点）

【文章構成のルール】
1. スコア（{score}点）に基づいた客観的な評価をしてください。
    - 70点以上：自信を持って応募を勧める。
    - 40〜69点：「あと一歩」と伝え、不足している具体的なスキル（求人にあって自分にないもの）を指摘する。
    - 39点以下：現状はミスマッチであることを誠実に伝え、まずは基礎学習を勧める。
2. 専門用語（RESTful、インフラ、技術スタック、親和性など）は一切禁止です。
    「サーバーの動かし方」「画面の見た目を作る技術」など、中学生でもわかる言葉に言い換えてください。
3. 箇条書きは使わず、500文字程度の自然な文章で作成してください。
4. 「この求人では〜」という形式で書き始めてください。
"""
    # 6. Geminiにプロントを送って、レスポンスを受け取る
    response = model.generate_content(prompt)
    
    # 7. レスポンスからテキストだけ取り出して返す
    return response.text.strip()



# ============================================
# 【追加】企業担当者が「この応募者はどう？」と聞くための関数
# ============================================
def generate_match_reason_for_company(
    user_skills: list[str],
    job_skills: list[str],
    score: int,
    user_intro: str
) -> str:
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        return "AIによる分析を利用できません。"
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash")

    # 5. 企業向けのプロンプト（採用のプロとしての視点）
    prompt = f"""
あなたはプロの採用コンサルタントとして、企業の人事担当者にアドバイスをしてください。
以下のデータをもとに、この応募者の「採用のメリット」と「懸念点」を客観的に分析してください。

【データ】
・応募者のスキル: {",".join(user_skills)}
・応募者の自己紹介: {user_intro}
・自社の必須スキル: {",".join(job_skills)}
・計算された適合度スコア: {score}点

【ルール】
1. 採用担当者が知りたい「即戦力性」と「教育コスト」に焦点を当ててください。
2. スコア（{score}点）が低い場合は、はっきりと「スキル不足」である理由を述べてください。
3. 専門用語（AWS、Docker、Reactなど）はそのまま使って構いません。
4. メリット・懸念点をそれぞれ含め、300文字〜500文字程度の自然な文章で作成してください。
5. 「この応募者は〜」という形式で書き始めてください。
"""
    response = model.generate_content(prompt)
    return response.text.strip()