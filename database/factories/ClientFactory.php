<?php

namespace Database\Factories;

use App\Models\Client;
use App\Utils\GlobalConstant;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'company_name' => $this->faker->company(),
            'email' => $this->faker->unique()->companyEmail(),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'client_type' => GlobalConstant::CLIENT_TYPE_RETAINER,
            'fee_percentage' => $this->faker->numberBetween(10, 25),
            'status' => GlobalConstant::STATUS_ACTIVE,
            'created_at' => $this->faker->dateTimeBetween('-3 months', '-1 week'),
            'updated_at' => now(),
        ];
    }
}
