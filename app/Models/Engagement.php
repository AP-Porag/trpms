<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Engagement extends BaseModel
{
    protected $fillable = [
        'client_id',
        'title',
        'description',
        'fee_type',
        'fee_value',
        'status',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class,'client_id');
    }
}
