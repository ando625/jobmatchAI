<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'job_posting_id',
        'user_id',
        'status',
        'match_score',
        'match_reason',
        'company_ai_comment'
    ];

    protected $casts = [
        'match_score' => 'integer',
    ];


    public function jobPosting()
    {
        return $this->belongsTo(JobPosting::class);
        // 「この応募は、特定の求人に対するものである」
    }

    public function user()
    {
        return $this->belongsTo(User::class);
        // 「この応募は、特定のユーザー（求職者）が行ったものである」
    }
}
