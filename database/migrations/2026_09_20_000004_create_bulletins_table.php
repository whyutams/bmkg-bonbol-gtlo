<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bulletins', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('edition', 100);
            $table->enum('category', ['buletin', 'peta', 'laporan'])->default('buletin');
            $table->string('file_path')->nullable();
            $table->string('file_size', 50)->default('3.2 MB');
            $table->string('file_type', 20)->default('PDF');
            $table->string('download_url')->nullable();
            $table->date('published_date');
            $table->boolean('is_published')->default(true);
            $table->text('summary')->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bulletins');
    }
};
