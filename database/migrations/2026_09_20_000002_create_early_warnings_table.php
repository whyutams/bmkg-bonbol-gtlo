<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('early_warnings', function (Blueprint $table) {
            $table->id();
            $table->enum('level', ['normal', 'waspada', 'siaga', 'awas'])->default('normal');
            $table->string('title');
            $table->text('description');
            $table->json('affected_areas')->nullable();
            $table->string('issued_at')->nullable();
            $table->string('valid_until')->default('24 Jam ke Depan');
            $table->boolean('is_active')->default(true);
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('early_warnings');
    }
};
