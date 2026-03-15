<?php

namespace App\Models;

use App\Utils\GlobalConstant;
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
        'fee_type',
        'fee_value',
        'category',
        'rating',
        'average_salary',
        'status',
        'created_by',
    ];

    protected $casts = [
        'fee_value' => 'decimal:2',
        'average_salary' => 'decimal:2',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    // Notes (polymorphic)
    public function notes(): MorphMany
    {
        return $this->morphMany(Note::class, 'noteable')->latest();
    }

    // Agreements
    public function agreements(): HasMany
    {
        return $this->hasMany(Agreement::class, "client_id");
    }

    // Jobs / Engagements
    public function jobs(): HasMany
    {
        return $this->hasMany(Engagement::class, "client_id");
    }

    /*
    |--------------------------------------------------------------------------
    | Query Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeClients($query)
    {
        return $query->where('category', 'client');
    }

    public function scopeProspects($query)
    {
        return $query->where('category',
            GlobalConstant::CLIENT_CATEGORY_PROSPECT
        );
    }

    public function scopeTargetAccounts($query)
    {
        return $query->where('category',GlobalConstant::CLIENT_CATEGORY_TARGET_ACCOUNT);
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    public function getFormattedFeeAttribute()
    {
        if ($this->fee_type === 'percentage') {
            return $this->fee_value . '%';
        }

        if ($this->fee_type === 'fixed') {
            return '$' . number_format($this->fee_value, 2);
        }

        return null;
    }
}
