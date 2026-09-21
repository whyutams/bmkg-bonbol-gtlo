<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PtspTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_number',
        'applicant_name',
        'institution',
        'email',
        'phone',
        'purpose_category',
        'data_requested',
        'date_range',
        'ktp_file',
        'letter_file',
        'tariff_amount',
        'is_free_education',
        'status',
        'admin_notes',
        'result_file',
        'processed_by',
    ];

    protected function casts(): array
    {
        return [
            'tariff_amount' => 'decimal:2',
            'is_free_education' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
