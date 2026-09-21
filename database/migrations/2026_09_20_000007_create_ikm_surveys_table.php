<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ikm_surveys', function (Blueprint $table) {
            $table->id();
            $table->string('respondent_name', 100)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('service_type', 100);
            $table->integer('q1_persyaratan')->default(4);
            $table->integer('q2_prosedur')->default(4);
            $table->integer('q3_waktu')->default(4);
            $table->integer('q4_biaya')->default(4);
            $table->integer('q5_produk')->default(4);
            $table->integer('q6_kompetensi')->default(4);
            $table->integer('q7_perilaku')->default(4);
            $table->integer('q8_sarana')->default(4);
            $table->integer('q9_pengaduan')->default(4);
            $table->decimal('score_total', 5, 2)->default(88.5);
            $table->text('feedback')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ikm_surveys');
    }
};
