<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'type',
        'entity_type',
        'entity_id',
        'title',
        'description',
        'start_at',
        'color',
        'status',
    ];

    protected $casts = [
        'start_at' => 'datetime',
    ];
}
