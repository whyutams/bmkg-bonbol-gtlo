<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bulletin extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'edition',
        'category',
        'file_path',
        'file_size',
        'file_type',
        'download_url',
        'published_date',
        'is_published',
        'summary',
        'uploaded_by',
    ];

    protected function casts(): array
    {
        return [
            'published_date' => 'date',
            'is_published' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
