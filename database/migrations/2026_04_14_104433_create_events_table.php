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
        Schema::create('events', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Event Identity
            |--------------------------------------------------------------------------
            */
            $table->string('type')->index(); // interview, offer, placement, invoice_sent, etc.

            /*
            |--------------------------------------------------------------------------
            | Entity Linking (for UI routing)
            |--------------------------------------------------------------------------
            */
            $table->string('entity_type')->nullable(); // job, placement, invoice, agreement
            $table->unsignedBigInteger('entity_id')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Display
            |--------------------------------------------------------------------------
            */
            $table->string('title');
            $table->text('description')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Timing
            |--------------------------------------------------------------------------
            */
            $table->timestamp('start_at');

            /*
            |--------------------------------------------------------------------------
            | UI Control
            |--------------------------------------------------------------------------
            */
            $table->string('color')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */
            $table->string('status')
                ->default(GlobalConstant::EVENT_STATUS_UPCOMING)
                ->index();

            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | Prevent Duplicate Events
            |--------------------------------------------------------------------------
            */
            $table->unique(['type', 'entity_type', 'entity_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
