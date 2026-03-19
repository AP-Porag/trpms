<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RevenueGoalBreakdown extends Model
{
    protected $fillable = [
        'revenue_goal_id',
        'rank',
        'company_count',
        'percent',
    ];

    public function revenueGoal()
    {
        return $this->belongsTo(RevenueGoal::class);
    }
}
