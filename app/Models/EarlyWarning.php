<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EarlyWarning extends Model
{
    use HasFactory;

    protected $fillable = [
        'level',
        'title',
        'description',
        'affected_areas',
        'issued_at',
        'valid_until',
        'is_active',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'affected_areas' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
