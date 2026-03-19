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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();

            $table->string('invoice_number')->unique();

            $table->foreignId('client_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->decimal('amount', 12, 2);

            $table->date('sent_date')->nullable();
            $table->date('paid_date')->nullable();

            $table->enum('status', [
                GlobalConstant::INVOICE_STATUS_ISSUED,
                GlobalConstant::INVOICE_STATUS_PAID,
                GlobalConstant::INVOICE_STATUS_CANCELED
            ])->default(GlobalConstant::INVOICE_STATUS_ISSUED);

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
