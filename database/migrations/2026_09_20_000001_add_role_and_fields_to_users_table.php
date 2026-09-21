<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['superadmin', 'admin', 'staf'])->default('staf')->after('email');
            $table->string('nip', 30)->nullable()->after('role');
            $table->string('jabatan', 100)->nullable()->after('nip');
            $table->enum('gender', ['laki-laki', 'perempuan'])->default('laki-laki')->after('jabatan');
            $table->string('avatar')->nullable()->after('gender');
            $table->string('phone', 20)->nullable()->after('avatar');
            $table->boolean('is_active')->default(true)->after('phone');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'nip', 'jabatan', 'gender', 'avatar', 'phone', 'is_active']);
        });
    }
};
