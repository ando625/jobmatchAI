<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobPosting extends Model
{
    protected $fillable = [
        'company_id',
        'title',
        'description',
        'required_skills',
        'salary_min',
        'salary_max',
        'location',
        'status',

    ];

    protected $casts = [
        'required_skills' => 'array',
        // DBには JSON文字列で入っている
        // 取り出す時に自動でPHPの配列に変換してくれる
        // 例： '["PHP","Laravel"]' → ['PHP', 'Laravel']
        'salary_min' => 'integer',
        'salary_max' => 'integer',
    ];

    // companies テーブルとのリレーション（紐付け）
    public function company()
    {
        return $this->belongsTo(Company::class);
        // 「このjob_postingはcompaniesテーブルの1件に属している」
        // company_id カラムで紐づく
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'job_posting_id');
    }
}
