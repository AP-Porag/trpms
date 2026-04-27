<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Lead extends Model
{
    protected $fillable = [
        'name',
        'company_name',
        'status',
        'industry_id',
        'source_id',
        'mpc',
        'current_openings'
    ];

    public function notes(): MorphMany
    {
        return $this->morphMany(Note::class, 'noteable')->latest();
    }
     public function contacts()
    {
        return $this->morphMany(Contact::class, 'contactable')->latest();
    }
    public function departments()
    {
        return $this->belongsToMany(Department::class, 'lead_department');
    }
    public function source()
    {
        return $this->belongsTo(Source::class, 'source_id');
    }
    public function industry()
    {
        return $this->belongsTo(Industry::class, 'industry_id');
    }
}
