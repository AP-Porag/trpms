<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends BaseModel
{
    protected $fillable = [
        'note',
        'noteable_id',
        'noteable_type',
        'created_by',
    ];

    public function noteable()
    {
        return $this->morphTo();
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
