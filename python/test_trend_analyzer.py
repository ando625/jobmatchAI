# test_trend_analyzer.py
# トレンド分析のテスト。本物の Gemini は呼ばず、httpx.post を偽物に差し替える。
# 実行: python -m unittest test_trend_analyzer.py

import os
import unittest
from unittest import mock

import trend_analyzer


class FakeResponse:
    def __init__(self, status_code: int, data: dict):
        self.status_code = status_code
        self._data = data

    def json(self):
        return self._data


def answer(text: str) -> FakeResponse:
    return FakeResponse(200, {"steps": [{"type": "model_output", "content": [{"type": "text", "text": text}]}]})


QUOTA = FakeResponse(429, {"error": {"code": "too_many_requests", "message": "You exceeded your current quota"}})


class AnalyzeSkillTrendTest(unittest.TestCase):
    def setUp(self):
        patcher = mock.patch.dict(os.environ, {"GEMINI_API_KEY": "test-key"})
        patcher.start()
        self.addCleanup(patcher.stop)

    def test_uses_google_search_when_available(self):
        with mock.patch("gemini_client.httpx.post", return_value=answer("検索した答え")) as post:
            result = trend_analyzer.analyze_skill_trend("React")

        self.assertEqual(result, "検索した答え")
        self.assertEqual(post.call_count, 1)
        self.assertEqual(post.call_args.kwargs["json"]["tools"], [{"type": "google_search"}])

    def test_answers_without_search_and_says_so_when_search_is_not_allowed(self):
        # 無料の枠では Google 検索が使えず 429 になる。そのときは検索なしで頼み直す。
        with mock.patch("gemini_client.httpx.post", side_effect=[QUOTA, answer("AIの知識の答え")]) as post:
            result = trend_analyzer.analyze_skill_trend("React")

        self.assertEqual(post.call_count, 2)
        self.assertNotIn("tools", post.call_args_list[1].kwargs["json"])
        self.assertNotIn("Google検索を使って", post.call_args_list[1].kwargs["json"]["input"])
        self.assertTrue(result.startswith(trend_analyzer.NO_SEARCH_NOTICE))
        self.assertIn("AIの知識の答え", result)

    def test_other_errors_are_not_hidden(self):
        error = FakeResponse(500, {"error": {"status": "INTERNAL"}})
        with mock.patch("gemini_client.httpx.post", return_value=error):
            with self.assertRaises(Exception):
                trend_analyzer.analyze_skill_trend("React")


if __name__ == "__main__":
    unittest.main()
