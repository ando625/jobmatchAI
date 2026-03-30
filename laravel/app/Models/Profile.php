<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'bio',
        'skills',
        'preferred_salary',
        'preferred_location',
    ];


    // json型（skills）を配列として扱えるようにする
    protected $casts = [
        'skills' => 'array',
    ];


    public function user(){
        return $this->belongsTo(User::class);
    }
}
