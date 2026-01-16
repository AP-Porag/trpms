<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agreement extends BaseModel
{
    protected $fillable = [
        'client_id',
        'file_path',
        'agreement_type',
        'signed_date'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class,'client_id');
    }


}
