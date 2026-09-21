<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IkmSurvey extends Model
{
    use HasFactory;

    protected $fillable = [
        'respondent_name',
        'email',
        'service_type',
        'q1_persyaratan',
        'q2_prosedur',
        'q3_waktu',
        'q4_biaya',
        'q5_produk',
        'q6_kompetensi',
        'q7_perilaku',
        'q8_sarana',
        'q9_pengaduan',
        'score_total',
        'feedback',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'score_total' => 'decimal:2',
        ];
    }
}
