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

            'status' => GlobalConstant::STATUS_ACTIVE,

            'created_at' => $this->faker->dateTimeBetween('-3 months', '-1 week'),

            'updated_at' => now(),

        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Client State
    |--------------------------------------------------------------------------
    */

    public function client()
    {
        return $this->state(function () {

            $clientType = $this->faker->randomElement([
                GlobalConstant::CLIENT_TYPE_RETAINER,
                GlobalConstant::CLIENT_TYPE_CONTINGENCY,
            ]);

            $feeType = $clientType === GlobalConstant::CLIENT_TYPE_CONTINGENCY
                ? GlobalConstant::JOB_FEE_TYPE_PERCENTAGE
                : GlobalConstant::JOB_FEE_TYPE_FIXED;

            $feeValue = $clientType === GlobalConstant::CLIENT_TYPE_CONTINGENCY
                ? $this->faker->numberBetween(15, 30)
                : $this->faker->numberBetween(2000, 10000);

            return [

                'category' => GlobalConstant::CLIENT_CATEGORY_CLIENT,

                'client_type' => $clientType,

                'fee_type' => $feeType,

                'fee_value' => $feeValue,

            ];

        });
    }

    /*
    |--------------------------------------------------------------------------
    | Prospect State
    |--------------------------------------------------------------------------
    */

    public function prospect()
    {
        return $this->state(function () {

            return [

                'category' => GlobalConstant::CLIENT_CATEGORY_PROSPECT,

                'client_type' => null,

                'fee_type' => null,

                'fee_value' => null,

            ];

        });
    }

    /*
    |--------------------------------------------------------------------------
    | Target Account State
    |--------------------------------------------------------------------------
    */

    public function targetAccount()
    {
        return $this->state(function () {

            return [

                'category' => GlobalConstant::CLIENT_CATEGORY_TARGET_ACCOUNT,

                'client_type' => null,

                'fee_type' => null,

                'fee_value' => null,

            ];

        });
    }
}
