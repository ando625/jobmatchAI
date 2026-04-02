<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Message extends Model
{
    protected $fillable = [
        'application_id',
        'sender_id',
        'content',
        'is_read'
    ];

    // 「このメッセージは、ある応募に属している」という関係
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    // 「このメッセージは、あるユーザーが送った」という関係
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
