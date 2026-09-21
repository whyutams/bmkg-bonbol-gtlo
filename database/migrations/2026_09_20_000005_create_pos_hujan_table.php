<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pos_hujan', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('code', 50)->unique();
            $table->string('district', 100);
            $table->enum('type', ['OBS', 'HELLMAN', 'AWS', 'ARG'])->default('OBS');
            $table->decimal('latitude', 10, 6);
            $table->decimal('longitude', 10, 6);
            $table->integer('elevation')->default(0);
            $table->enum('status', ['aktif', 'kalibrasi', 'rusak'])->default('aktif');
            $table->text('address')->nullable();
            $table->string('pic_name', 100)->nullable();
            $table->string('pic_phone', 30)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_hujan');
    }
};
