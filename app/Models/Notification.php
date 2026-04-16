<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Notification extends Model
{
    protected $fillable = [
        'type',
        'entity_type',
        'entity_id',
        'title',
        'description',
        'icon_letter',
        'is_seen',
        'route_name',
        'route_param',
        'created_at',
    ];

    protected $casts = [
        'is_seen' => 'boolean',
        'created_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    public function entity(): MorphTo
    {
        return $this->morphTo(null, 'entity_type', 'entity_id');
    }

    /*
    |--------------------------------------------------------------------------
    | SCOPES (IMPORTANT FOR DROPDOWN)
    |--------------------------------------------------------------------------
    */

    public function scopeForDropdown($query)
    {
        return $query->where(function ($q) {
            $q->where('is_seen', false)
                ->orWhereMonth('created_at', now()->month);
        });
    }

    public function scopeUnseen($query)
    {
        return $query->where('is_seen', false);
    }
}
