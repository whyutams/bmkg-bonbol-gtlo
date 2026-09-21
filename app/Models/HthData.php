<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HthData extends Model
{
    use HasFactory;

    protected $table = 'hth_data';

    protected $fillable = [
        'region_name',
        'district_name',
        'days_without_rain',
        'risk_category',
        'status_label',
        'dasarian',
        'month',
        'year',
        'observation_date',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'days_without_rain' => 'integer',
            'year' => 'integer',
            'observation_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public static function determineCategory(int $days): array
    {
        if ($days <= 5) {
            return ['category' => 'Sangat Pendek', 'label' => 'Aman / Kondusif', 'color' => 'emerald'];
        } elseif ($days <= 10) {
            return ['category' => 'Pendek', 'label' => 'Waspada Awal', 'color' => 'amber'];
        } elseif ($days <= 20) {
            return ['category' => 'Menengah', 'label' => 'Siaga Kekeringan', 'color' => 'orange'];
        } else {
            return ['category' => 'Panjang / Ekstrem', 'label' => 'Awas Kekeringan Ekstrem', 'color' => 'red'];
        }
    }
}
