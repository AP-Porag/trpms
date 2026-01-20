<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Agreement extends BaseModel
{

    use HasFactory;
    protected $fillable = [
        'client_id',
        'file_path',
        'original_name',
        'agreement_type',
        'signed_date'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class,'client_id');
    }


}
