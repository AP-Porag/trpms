<?php

namespace Database\Factories;

use App\Models\Engagement;
use App\Utils\GlobalConstant;
use Illuminate\Database\Eloquent\Factories\Factory;

class EngagementFactory extends Factory
{
    protected $model = Engagement::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->jobTitle(),
            'description' => $this->faker->paragraph(4),
            'salary_range' => $this->faker->randomElement([
                '40k - 60k', '60k - 80k', '80k - 100k'
            ]),
            'fee_type' => GlobalConstant::JOB_FEE_TYPE_PERCENTAGE,
            'fee_value' => $this->faker->numberBetween(15, 30),
            'status' => GlobalConstant::STATUS_ACTIVE,
            'created_at' => $this->faker->dateTimeBetween('-2 months', '-3 days'),
            'updated_at' => now(),
        ];
    }
}
