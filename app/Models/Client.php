<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Client extends BaseModel
{

    use HasFactory;
    protected $fillable = [
        'name',
        'company_name',
        'email',
        'phone',
        'address',
        'client_type',
        'fee_percentage',
        'status',
        'note',
        'created_by',
    ];

//    protected $casts = [
//        'status' => 'integer',
//    ];

    // Notes (polymorphic)
    public function notes():MorphMany
    {
        return $this->morphMany(Note::class, 'noteable')->latest();
    }

    public function agreements(): HasMany
    {
        return $this->hasMany(Agreement::class,"client_id");
    }

    public function jobs():HasMany
    {
        return $this->hasMany(Engagement::class,"client_id");
    }

//    public function invoices()
//    {
//        return $this->hasMany(Invoice::class);
//    }
}
