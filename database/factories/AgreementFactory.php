<?php

namespace Database\Factories;

use App\Models\Agreement;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AgreementFactory extends Factory
{
    protected $model = Agreement::class;

    public function definition(): array
    {
        return [
            'file_path' => 'agreements/' . Str::random(24) . '.pdf',
            'original_name' => 'agreement.pdf',
            'agreement_type' => $this->faker->randomElement(['retainer','exclusive']),
            'signed_date' => $this->faker->date(),
            'created_at' => $this->faker->dateTimeBetween('-6 months', '-1 month'),
            'updated_at' => now(),
        ];
    }
}
