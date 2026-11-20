# gemini_client.py
# Gemini の Interactions API を呼ぶための共通の窓口。
#
# 新しい形式（AQ. で始まる）の API キーでは、以前の generate_content が 404 になるため、
# Interactions API（POST /v1beta/interactions）で呼びます。
# API キーは URL に入れず、ヘッダー（x-goog-api-key）で送ります。

import os

import httpx

ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions"
API_REVISION = "2026-05-20"
DEFAULT_MODEL = "gemini-3.5-flash-lite"


class GeminiError(Exception):
    """Gemini の呼び出しに失敗したときのエラー（キーの値は含めない）"""

    def __init__(self, message: str, status_code: int | None = None):
        super().__init__(message)
        self.status_code = status_code


def extract_text(interaction: dict) -> str:
    """返事の steps のうち、最後の model_output から文（type: text）を取り出してつなげる。

    先頭に考えた過程（thought）や検索（google_search_call / google_search_result）の
    step が入ることがあるため、それらは読まない。
    """
    outputs = [s for s in interaction.get("steps", []) if isinstance(s, dict) and s.get("type") == "model_output"]
    if not outputs:
        return ""
    texts = [
        c.get("text", "")
        for c in outputs[-1].get("content", [])
        if isinstance(c, dict) and c.get("type") == "text"
    ]
    return "".join(texts).strip()


def generate_text(prompt: str, tools: list[dict] | None = None, timeout: float = 90.0) -> str:
    """プロンプトを送り、AI が書いた文を返す。tools に [{"type": "google_search"}] を渡すと検索も使う。"""
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        raise GeminiError("GEMINI_API_KEY が設定されていません")

    body: dict = {"model": os.getenv("GEMINI_MODEL", DEFAULT_MODEL), "input": prompt}
    if tools:
        body["tools"] = tools

    response = httpx.post(
        ENDPOINT,
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": api_key,
            "Api-Revision": API_REVISION,
        },
        json=body,
        timeout=timeout,
    )
    if response.status_code >= 400:
        try:
            status = response.json().get("error", {}).get("status", "")
        except ValueError:
            status = ""
        raise GeminiError(
            f"Gemini API request failed: {response.status_code} {status} (model: {body['model']})",
            status_code=response.status_code,
        )

    text = extract_text(response.json())
    if not text:
        raise GeminiError("Gemini API returned an empty answer")
    return text
