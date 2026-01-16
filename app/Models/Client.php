<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends BaseModel
{
    protected $fillable = [
        'name',
        'company_name',
        'email',
        'phone',
        'address',
        'client_type',
        'fee_percentage',
        'status',
    ];

    protected $casts = [
        'status' => 'integer',
    ];

    // Notes (polymorphic)
    public function notes()
    {
        return $this->morphMany(Note::class, 'noteable')->latest();
    }

    public function agreements(): HasMany
    {
        return $this->hasMany(Agreement::class,"client_id");
    }

    // Future-safe relations
//    public function jobs()
//    {
//        return $this->hasMany(Job::class);
//    }

//    public function invoices()
//    {
//        return $this->hasMany(Invoice::class);
//    }
}
