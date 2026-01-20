<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Engagement extends BaseModel
{

    use HasFactory;
    protected $fillable = [
        'client_id',
        'title',
        'description',
        'fee_type',
        'fee_value',
        'status',
    ];

    public function client():BelongsTo
    {
        return $this->belongsTo(Client::class,'client_id');
    }
}
