# matcher.py
# 「スキルがどれだけ一致しているか」を0〜100で計算するファイル

# ユーザーのスキルと求人のスキルを受け取ってマッチ度を返す関数
def calc_jaccard_score(user_skills: list[str], job_skills: list[str]) -> int:
    if not user_skills or not job_skills:
        return 0


    # 重複なしの集合（set）
    user_set = set(user_skills)
    job_set = set(job_skills)

    # 両方にあるスキルだけ取り出す　積集合(AND)
    intersection = user_set & job_set

    # どちらかが持ってるスキルを全部集める　和集合(OR)
    union = user_set | job_set

    # スコア計算　共通スキル÷全体スキル×100で%にする
    return int(len(intersection) / len(union) * 100)