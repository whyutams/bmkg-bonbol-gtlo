<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hth_data', function (Blueprint $table) {
            $table->id();
            $table->string('region_name', 100);
            $table->string('district_name', 100);
            $table->integer('days_without_rain')->default(0);
            $table->string('risk_category', 50)->default('Sangat Pendek');
            $table->string('status_label', 100)->default('Aman / Kondusif');
            $table->enum('dasarian', ['I', 'II', 'III'])->default('I');
            $table->string('month', 20)->default('September');
            $table->integer('year')->default(2026);
            $table->date('observation_date')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hth_data');
    }
};
