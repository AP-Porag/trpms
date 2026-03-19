<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RevenueGoal extends Model
{
    protected $fillable = [
        'year',
        'yearly_goal',
    ];

    public function breakdowns()
    {
        return $this->hasMany(RevenueGoalBreakdown::class);
    }
}
