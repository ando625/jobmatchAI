<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchPreview extends Model
{
    protected $fillable = [
        'user_id',
        'job_posting_id',
        'match_score',
        'match_reason'
    ];

    public function user()
    {
        // 1つの診断は1人のユーザーのもの
        return $this->belongsTo(User::class);
    }

    public function jobPosting()
    {
        // 1つの診断は1つの求人に対するもの
        return $this->belongsTo(JobPosting::class);
    }
}
