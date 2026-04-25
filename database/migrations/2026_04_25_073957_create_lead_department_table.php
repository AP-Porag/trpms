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
        Schema::create('lead_department', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('department_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->unique(['lead_id', 'department_id']); // duplicate prevent
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lead_department');
    }
};
