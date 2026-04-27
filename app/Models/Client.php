<?php

namespace App\Models;

use App\Utils\GlobalConstant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;

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
        'industry_id',
        'departments',
        'average_salary',
        'agreement_type',
        'signed_date',
        'status',
        'created_by',
    ];

    protected $casts = [
        'fee_value' => 'decimal:2',
        'average_salary' => 'decimal:2',
        'departments' => 'array',
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

    //Contact (ploymorphic)
    public function contacts()
    {
        return $this->morphMany(Contact::class, 'contactable')->latest();
    }

    // Agreements
    public function agreements(): hasMany
    {
        return $this->hasMany(Agreement::class, "client_id");
    }

    // Industry
    public function industry(): BelongsTo
    {
        return $this->belongsTo(Industry::class);
    }

    // Department



    // Jobs / Engagements
    public function jobs(): HasMany
    {
        return $this->hasMany(Engagement::class, "client_id");
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
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
        return $query->where(
            'category',
            GlobalConstant::CLIENT_CATEGORY_PROSPECT
        );
    }

    public function scopeTargetAccounts($query)
    {
        return $query->where('category', GlobalConstant::CLIENT_CATEGORY_TARGET_ACCOUNT);
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


    public function departments()
    {
        return $this->belongsToMany(Department::class, 'client_department')
            ->withTimestamps(); // ✅ only this
    }
}
