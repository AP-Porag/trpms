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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            // 🔹 Type (interview, invoice_paid, etc.)
            $table->string('type')->index();

            // 🔹 Entity reference (generic linking)
            $table->string('entity_type')->nullable()->index(); // job, placement, invoice
            $table->unsignedBigInteger('entity_id')->nullable()->index();

            // 🔹 Content (UI controlled from GlobalConstant)
            $table->string('title');
            $table->text('description')->nullable();

            // 🔹 UI helper (alphabet icon like J, I, P)
            $table->string('icon_letter', 2)->nullable(); // J, I, P, etc.

            // 🔹 Status
            $table->boolean('status')->default(GlobalConstant::NOTIFICATION_STATUS_UNSEEN)->index();

            // 🔹 Optional direct navigation (NOT full URL, just route key)
            $table->string('route_name')->nullable(); // jobs.show
            $table->unsignedBigInteger('route_param')->nullable(); // id

            // 🔹 Timestamp (important for sorting & filtering)
            $table->timestamps();

            // 🔹 Index for performance
            $table->index(['entity_type', 'entity_id']);
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
