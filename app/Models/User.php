<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'nip',
        'jabatan',
        'gender',
        'avatar',
        'phone',
        'is_active',
    ];

    protected $appends = [
        'avatar_url',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'superadmin';
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['superadmin', 'admin']);
    }

    public function isStaf(): bool
    {
        return in_array($this->role, ['superadmin', 'admin', 'staf']);
    }

    public function getRoleBadgeAttribute(): array
    {
        return match($this->role) {
            'superadmin' => ['label' => 'Super Admin', 'color' => 'bg-amber-100 text-amber-800 border-amber-300'],
            'admin' => ['label' => 'Admin', 'color' => 'bg-blue-100 text-blue-800 border-blue-300'],
            default => ['label' => 'Staf', 'color' => 'bg-emerald-100 text-emerald-800 border-emerald-300'],
        };
    }

    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar) {
            if (str_starts_with($this->avatar, 'avatar_')) {
                return asset('images/avatars/' . $this->avatar);
            }
            if (str_starts_with($this->avatar, 'http') || str_starts_with($this->avatar, '/')) {
                return $this->avatar;
            }
            return asset('storage/' . $this->avatar);
        }

        $defaultName = in_array($this->gender, ['wanita', 'perempuan']) ? 'avatar_wanita_1.svg' : 'avatar_pria_1.svg';
        return asset('images/avatars/' . $defaultName);
    }
}
