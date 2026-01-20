<?php

namespace Database\Factories;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Factories\Factory;
class ActivityLogFactory extends Factory
{
    protected $model = ActivityLog::class;

    public function definition(): array
    {
        return [
            'actor_id' => null,
            'event' => $this->faker->randomElement([
                'created', 'updated', 'stage_changed', 'placed'
            ]),
            'metadata' => [
                'note' => $this->faker->sentence()
            ],
            'created_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'updated_at' => now(),
        ];
    }
}
