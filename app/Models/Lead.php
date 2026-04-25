<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
