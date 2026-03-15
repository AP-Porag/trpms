<?php

use App\Utils\GlobalConstant;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();

            $table->string('name');

            $table->string('company_name');

            $table->string('email')->nullable();

            $table->string('phone')->nullable();

            $table->string('address')->nullable();


            /*
            |--------------------------------------------------------------------------
            | Client Type
            |--------------------------------------------------------------------------
            | Only filled when category = client
            */

            $table->string('client_type')->nullable();


            /*
            |--------------------------------------------------------------------------
            | Fee Configuration
            |--------------------------------------------------------------------------
            */

            $table->string('fee_type')->nullable(); // percentage | fixed

            $table->decimal('fee_value', 10, 2)->nullable();


            /*
            |--------------------------------------------------------------------------
            | Category
            |--------------------------------------------------------------------------
            | client / prospect / target_account
            */

            $table->string('category')
                ->default(GlobalConstant::CLIENT_CATEGORY_CLIENT)
                ->index();


            /*
            |--------------------------------------------------------------------------
            | Client Rating
            |--------------------------------------------------------------------------
            | A / B / C (from Excel)
            */

            $table->string('rating')->nullable();


            /*
            |--------------------------------------------------------------------------
            | Forecast Planning
            |--------------------------------------------------------------------------
            */

            $table->decimal('average_salary', 12, 2)->nullable();


            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            $table->integer('status')
                ->default(GlobalConstant::STATUS_ACTIVE);


            /*
            |--------------------------------------------------------------------------
            | Created By
            |--------------------------------------------------------------------------
            */

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
