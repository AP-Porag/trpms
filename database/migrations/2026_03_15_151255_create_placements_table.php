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
        Schema::create('placements', function (Blueprint $table) {
            $table->id();

            $table->foreignId('job_candidate_id')->constrained()->cascadeOnDelete();

            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('job_id')->constrained('engagements')->cascadeOnDelete();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete();

            $table->enum('fee_type', [GlobalConstant::JOB_FEE_TYPE_PERCENTAGE, GlobalConstant::JOB_FEE_TYPE_FIXED, GlobalConstant::JOB_FEE_TYPE_RETAINED])->default(GlobalConstant::JOB_FEE_TYPE_PERCENTAGE);

            $table->decimal('salary', 12, 2)->nullable();
            $table->decimal('fee_percentage', 5, 2)->nullable();
            $table->decimal('placement_fee', 12, 2)->nullable();

            $table->date('offer_accepted_at')->nullable();
            $table->date('placement_date');
            $table->date('start_date')->nullable();

            $table->date('guarantee_end_date')->nullable();

            $table->foreignId('recruiter_id')->nullable()->constrained('users');
            $table->foreignId('created_by')->nullable()->constrained('users');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('placements');
    }
};
