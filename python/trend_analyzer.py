import os
from gemini_client import GeminiError, generate_text

# 無料の枠では Google 検索つきの呼び出しが使えない（429 / 403 が返る）。
# そのときは検索なしで頼み直し、答えの先頭でそのことを正直に伝える。
NO_SEARCH_NOTICE = "※ 今回は最新の検索を使わず、AIがすでに持っている知識で答えています。"
SEARCH_NOT_ALLOWED = (429, 403)

PROMPT_TEMPLATE = """
    あなたはIT業界の最新動向に詳しいキャリアアドバイザーです。
    
    【調査対象】
    2026年現在の「{skill_name}」の最新トレンド
    
    【やってほしいこと】
    {how}初心者が「次に何を目指せばいいか」をアドバイスしてください。
    
    【絶対に守るルール：大人（求職者）への優しいアドバイス】
    1. 説明のわかりやすさは「中学生」でも理解できるレベルを徹底してください。
    2. 専門用語（RSC、レンダリング、型定義、コンポーネント指向など）は「そのまま」使わないでください。
       使う場合は必ずわかりやすく日常にあるものに例えて説明してください。
    3. 漢字ばかりの難しい説明は避け、親しみやすい話し言葉で書いてください。
    4. 「求人」や「キャリア」の話ではなく、「プログラミングを楽しく続けるためのヒント」として教えてください。
    5. 具体的に学ぶべきことを3つ挙げ、それぞれ「なぜそれが楽しいのか、便利なのか」を教えてください。
    6. 対象は「成人している求職者」ですので、子供っぽくなりすぎず、丁寧な敬語（です・ます調）で話してください。
    """


def build_prompt(skill_name: str, use_search: bool) -> str:
    how = (
        "Google検索を使って最新状況を調べた上で、"
        if use_search
        else "あなたがすでに持っている知識をもとに（最新の情報ではない可能性があることを踏まえて）、"
    )
    return PROMPT_TEMPLATE.format(skill_name=skill_name, how=how)


def analyze_skill_trend(skill_name: str)-> str:
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        return "APIキーが設定されていないため検索できません"

    try:
        # まず Google 検索を使って最新の情報を調べてから答えてもらう
        return generate_text(build_prompt(skill_name, use_search=True), tools=[{"type": "google_search"}])
    except GeminiError as e:
        if e.status_code not in SEARCH_NOT_ALLOWED:
            raise
    # 検索が使えなかったので、検索なしで頼み直す（そのことを先頭で伝える）
    answer = generate_text(build_prompt(skill_name, use_search=False))
    return f"{NO_SEARCH_NOTICE}\n\n{answer}"
