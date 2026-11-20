# test_gemini_client.py
# gemini_client.py のテスト。本物の Gemini は呼ばず、httpx.post を偽物に差し替える。
# 実行: python -m unittest test_gemini_client.py

import os
import unittest
from unittest import mock

import gemini_client


class FakeResponse:
    def __init__(self, status_code: int, data: dict):
        self.status_code = status_code
        self._data = data

    def json(self):
        return self._data


INTERACTION = {
    "status": "completed",
    "steps": [
        {"type": "thought", "content": []},
        {"type": "google_search_call", "arguments": {"queries": ["React 2026"]}},
        {"type": "model_output", "content": [{"type": "text", "text": "  Reactは"}, {"type": "text", "text": "人気です。 "}]},
    ],
}


class ExtractTextTest(unittest.TestCase):
    def test_reads_only_the_last_model_output(self):
        self.assertEqual(gemini_client.extract_text(INTERACTION), "Reactは人気です。")

    def test_returns_empty_when_no_model_output(self):
        self.assertEqual(gemini_client.extract_text({"steps": [{"type": "thought"}]}), "")


class GenerateTextTest(unittest.TestCase):
    def setUp(self):
        patcher = mock.patch.dict(os.environ, {"GEMINI_API_KEY": "test-key"}, clear=False)
        patcher.start()
        self.addCleanup(patcher.stop)
        os.environ.pop("GEMINI_MODEL", None)

    def test_sends_key_in_header_and_uses_interactions_api(self):
        with mock.patch("gemini_client.httpx.post", return_value=FakeResponse(200, INTERACTION)) as post:
            text = gemini_client.generate_text("質問", tools=[{"type": "google_search"}])

        self.assertEqual(text, "Reactは人気です。")
        url = post.call_args.args[0]
        kwargs = post.call_args.kwargs
        self.assertEqual(url, "https://generativelanguage.googleapis.com/v1beta/interactions")
        self.assertNotIn("test-key", url)
        self.assertEqual(kwargs["headers"]["x-goog-api-key"], "test-key")
        self.assertEqual(kwargs["json"]["model"], "gemini-3.5-flash-lite")
        self.assertEqual(kwargs["json"]["input"], "質問")
        self.assertEqual(kwargs["json"]["tools"], [{"type": "google_search"}])

    def test_raises_without_key_in_message(self):
        error = FakeResponse(404, {"error": {"code": 404, "status": "NOT_FOUND"}})
        with mock.patch("gemini_client.httpx.post", return_value=error):
            with self.assertRaises(gemini_client.GeminiError) as ctx:
                gemini_client.generate_text("質問")
        self.assertIn("404 NOT_FOUND", str(ctx.exception))
        self.assertNotIn("test-key", str(ctx.exception))

    def test_raises_when_key_is_missing(self):
        with mock.patch.dict(os.environ, {"GEMINI_API_KEY": ""}):
            with self.assertRaises(gemini_client.GeminiError):
                gemini_client.generate_text("質問")


if __name__ == "__main__":
    unittest.main()
