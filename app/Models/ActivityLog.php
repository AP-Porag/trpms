<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class ActivityLog extends BaseModel
{
    use HasFactory;
    protected $fillable = [
        'actor_id',
        'subject_type',
        'subject_id',
        'event',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    /* -----------------------------
     | Relationships
     |-----------------------------*/

    public function actor():BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public function subject():MorphTo
    {
        return $this->morphTo();
    }
}
