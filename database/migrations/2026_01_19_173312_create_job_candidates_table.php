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
        Schema::create('job_candidates', function (Blueprint $table) {
            $table->id();

            $table->foreignId('job_id')->constrained('engagements')->cascadeOnDelete();
            $table->foreignId('candidate_id')->constrained('candidates')->cascadeOnDelete();

            $table->string('stage')->index();

            // Stage timestamps
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('interviewing_at')->nullable();
            $table->timestamp('offered_at')->nullable();
            $table->timestamp('placed_at')->nullable();
            $table->timestamp('rejected_at')->nullable();

            // Interview scheduling
            $table->timestamp('interview_scheduled_at')->nullable();

            $table->timestamps();

            $table->unique(['job_id', 'candidate_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_candidates');
    }
};
