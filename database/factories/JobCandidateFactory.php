<?php

namespace Database\Factories;

use App\Models\JobCandidate;
use Illuminate\Database\Eloquent\Factories\Factory;
class JobCandidateFactory extends Factory
{
    protected $model = JobCandidate::class;

    public function definition(): array
    {
        $stage = $this->faker->randomElement([
            'submitted', 'interviewing', 'offered', 'placed', 'rejected'
        ]);

        $now = now()->subDays(rand(1, 20));

        return [
            'stage' => $stage,
            'submitted_at' => in_array($stage, ['submitted','interviewing','offered','placed']) ? $now : null,
            'interviewing_at' => in_array($stage, ['interviewing','offered','placed']) ? $now->copy()->addDays(2) : null,
            'offered_at' => in_array($stage, ['offered','placed']) ? $now->copy()->addDays(5) : null,
            'placed_at' => $stage === 'placed' ? $now->copy()->addDays(7) : null,
            'rejected_at' => $stage === 'rejected' ? $now->copy()->addDays(3) : null,
            'interview_scheduled_at' => $stage === 'interviewing'
                ? $now->copy()->addDays(1)
                : null,
            'created_at' => $now,
            'updated_at' => now(),
        ];
    }
}
