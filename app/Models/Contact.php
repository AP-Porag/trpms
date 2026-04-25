<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends BaseModel
{
    protected $fillable = [
        'label',
        'name',
        'contact_type',
        'contact',
    ];

    public function contactable()
    {
        return $this->morphTo();
    }
}
