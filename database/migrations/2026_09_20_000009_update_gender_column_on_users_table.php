<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE users MODIFY COLUMN gender VARCHAR(20) DEFAULT 'pria'");
        DB::statement("UPDATE users SET gender = 'pria' WHERE gender = 'laki-laki'");
        DB::statement("UPDATE users SET gender = 'wanita' WHERE gender = 'perempuan'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE users MODIFY COLUMN gender ENUM('laki-laki', 'perempuan') DEFAULT 'laki-laki'");
    }
};
