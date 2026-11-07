<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username', 20)->unique()->after('name');
            $table->string('role', 10)->default('user')->after('username');   // user | admin
            $table->string('status', 10)->default('active')->after('role');   // active | suspended
            $table->timestamp('last_login_at')->nullable();
            $table->timestamp('previous_login_at')->nullable();
            $table->string('email')->nullable()->change(); // this system signs in by username
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'role', 'status', 'last_login_at', 'previous_login_at']);
        });
    }
};
