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

    protected $appends = ['author_name'];
    protected $hidden = ['author'];

    public function noteable()
    {
        return $this->morphTo();
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getAuthorNameAttribute()
    {
        if (!$this->author) {
            return 'Unknown';
        }

        return $this->author->first_name . ' ' . $this->author->last_name;
    }
}
