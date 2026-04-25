<?php

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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Exactech
            $table->string('company_name'); // Exactech

            $table->boolean('status'); // Contract Sent, Prospect

            $table->foreignId('industry_id')->nullable()->constrained()->nullOnDelete();
            $table->string('current_openings')->nullable();

            $table->foreignId('source_id')->nullable()->constrained()->nullOnDelete(); // Dripify / LinkedIn
            $table->string('mpc')->nullable(); // Max Johnson
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
