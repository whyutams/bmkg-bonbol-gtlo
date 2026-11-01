<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LocalEarthquake extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_time',
        'magnitude',
        'depth_km',
        'latitude',
        'longitude',
        'epicenter_location',
        'felt_scale_mmi',
        'tsunami_potential',
        'shakemap_image',
        'notes',
        'is_published',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'event_time' => 'datetime',
            'is_published' => 'boolean',
            'magnitude' => 'float',
            'depth_km' => 'integer',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    protected function serializeDate(\DateTimeInterface $date): string
    {
        return $date->setTimezone(new \DateTimeZone('Asia/Makassar'))->format('Y-m-d\TH:i:sP');
    }
}

