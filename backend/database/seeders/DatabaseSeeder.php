<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Demo administrator: admin / admin123. Change this password after first login.
        $admin = User::firstOrNew(['username' => 'admin']);
        $admin->forceFill([
            'name' => 'Administrator',
            'role' => 'admin',
            'status' => 'active',
            'password' => 'admin123',
        ])->save();
    }
}
