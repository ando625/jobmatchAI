import os
from google import genai
from google.genai import types

def analyze_skill_trend(skill_name: str)-> str:
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        return "APIキーが設定されていないため検索できません"
    
    client = genai.Client(api_key=api_key)
    
    google_search_tool = types.Tool(
        google_search=types.GoogleSearch()
    )
    
    prompt = f"""
    あなたはIT業界の最新動向に詳しいキャリアアドバイザーです。
    
    【調査対象】
    2026年現在の「{skill_name}」の最新トレンド
    
    【やってほしいこと】
    Google検索を使って最新状況を調べた上で、初心者が「次に何を目指せばいいか」をアドバイスしてください。
    
    【絶対に守るルール：大人（求職者）への優しいアドバイス】
    1. 説明のわかりやすさは「中学生」でも理解できるレベルを徹底してください。
    2. 専門用語（RSC、レンダリング、型定義、コンポーネント指向など）は「そのまま」使わないでください。
       使う場合は必ずわかりやすく日常にあるものに例えて説明してください。
    3. 漢字ばかりの難しい説明は避け、親しみやすい話し言葉で書いてください。
    4. 「求人」や「キャリア」の話ではなく、「プログラミングを楽しく続けるためのヒント」として教えてください。
    5. 具体的に学ぶべきことを3つ挙げ、それぞれ「なぜそれが楽しいのか、便利なのか」を教えてください。
    6. 対象は「成人している求職者」ですので、子供っぽくなりすぎず、丁寧な敬語（です・ます調）で話してください。
    """
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            tools=[{ "google_search": {} }] # 直接ツールを定義する書き方に変更
        )
    )
    
    return response.text.strip()