<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Predefined administrator. Change the password after your first login.
        $admin = User::firstOrNew(['username' => 'admin']);
        $admin->forceFill([
            'name' => 'Administrator',
            'email' => 'admin@abc.com',
            'role' => 'admin',
            'status' => 'active',
            'password' => 'admin123', // hashed by the model cast (bcrypt)
        ])->save();
    }
}
