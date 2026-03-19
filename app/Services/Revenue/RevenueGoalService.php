<?php

namespace App\Services\Revenue;

class RevenueGoalService
{

    public function calculateBreakdowns($yearlyGoal, $breakdowns)
    {

        $result = [];

        foreach ($breakdowns as $row) {

            $percent = $row['percent'];
            $companies = $row['company_count'];

            $rankRevenue = ($yearlyGoal * $percent) / 100;

            $target = $companies > 0
                ? $rankRevenue / $companies
                : 0;

            $low = $target * 0.8;
            $high = $target * 1.2;

            $weeklyTarget = $target / 52;
            $weeklyLow = $low / 52;
            $weeklyHigh = $high / 52;

            $result[] = [
                'rank' => $row['rank'],
                'label' => $this->rankLabel($row['rank']),
                'company_count' => $companies,
                'percent' => $percent,

                'target' => round($target, 2),
                'low' => round($low, 2),
                'high' => round($high, 2),

                'weekly_target' => round($weeklyTarget, 2),
                'weekly_low' => round($weeklyLow, 2),
                'weekly_high' => round($weeklyHigh, 2),
            ];
        }

        return $result;
    }

    private function rankLabel($rank)
    {
        return match ($rank) {
            'A' => 'A Clients',
            'B' => 'B Clients',
            'C' => 'C Clients',
        };
    }
}
