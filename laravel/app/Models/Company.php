<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'user_id',
        'company_name',
        'description',
        'location',
    ];

    // companiesが持つ求人一覧
    public function jobPostings()
    {
        return $this->hasMany(JobPosting::class);
        // 「このcompanyは複数のjob_postingsを持つ」
        // company_id で紐づく
    }

    public function user()
    {
        return $this->belongsTo(User::class);
        // 「この会社情報は、特定のユーザー（企業アカウント）に属している」
    }
}
