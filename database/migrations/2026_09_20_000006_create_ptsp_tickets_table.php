<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ptsp_tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number', 50)->unique();
            $table->string('applicant_name', 150);
            $table->string('institution', 150);
            $table->string('email', 100);
            $table->string('phone', 30);
            $table->string('purpose_category', 100);
            $table->text('data_requested');
            $table->string('date_range', 100)->nullable();
            $table->string('ktp_file')->nullable();
            $table->string('letter_file')->nullable();
            $table->decimal('tariff_amount', 12, 2)->default(0);
            $table->boolean('is_free_education')->default(false);
            $table->enum('status', ['menunggu', 'diproses', 'selesai', 'ditolak'])->default('menunggu');
            $table->text('admin_notes')->nullable();
            $table->string('result_file')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ptsp_tickets');
    }
};
