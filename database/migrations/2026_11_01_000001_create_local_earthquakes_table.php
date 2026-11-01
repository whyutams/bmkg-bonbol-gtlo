<?php

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
        Schema::create('local_earthquakes', function (Blueprint $table) {
            $table->id();
            $table->dateTime('event_time');
            $table->decimal('magnitude', 3, 1);
            $table->unsignedInteger('depth_km');
            $table->string('latitude', 30);
            $table->string('longitude', 30);
            $table->string('epicenter_location', 255);
            $table->string('felt_scale_mmi', 255)->nullable();
            $table->string('tsunami_potential', 100)->default('Tidak Berpotensi TSUNAMI');
            $table->string('shakemap_image', 255)->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_published')->default(true);
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('local_earthquakes');
    }
};

