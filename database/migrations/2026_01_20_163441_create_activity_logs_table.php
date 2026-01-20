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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();

            // Who did the action
            $table->foreignId('actor_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // Polymorphic subject (Job, JobCandidate, Invoice, etc.)
            $table->string('subject_type');   // App\Models\JobCandidate
            $table->unsignedBigInteger('subject_id');

            // High-level event key
            $table->string('event')->index();

            // Structured context
            $table->json('metadata')->nullable();

            $table->timestamps();

            $table->index(['subject_type', 'subject_id']);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
