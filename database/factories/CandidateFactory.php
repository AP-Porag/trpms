<?php

namespace Database\Factories;

use App\Models\Candidate;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CandidateFactory extends Factory
{
    protected $model = Candidate::class;

    public function definition(): array
    {
        $originalName = $this->faker->randomElement([
            'resume.pdf', 'cv.docx', 'profile.pdf'
        ]);

        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'expected_salary' => $this->faker->numberBetween(40000, 120000),
            'resume_path' => 'resumes/' . Str::random(32) . '.' . pathinfo($originalName, PATHINFO_EXTENSION),
            'original_name' => $originalName,
            'created_at' => $this->faker->dateTimeBetween('-4 months', '-2 weeks'),
            'updated_at' => now(),
        ];
    }
}
