<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoginActivity extends Model
{
    public $timestamps = false;

    protected $fillable = ['username', 'role', 'result', 'ip_address'];

    protected function casts(): array
    {
        return ['created_at' => 'datetime'];
    }
}
