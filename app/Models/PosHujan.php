<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PosHujan extends Model
{
    use HasFactory;

    protected $table = 'pos_hujan';

    protected $fillable = [
        'name',
        'code',
        'district',
        'type',
        'latitude',
        'longitude',
        'elevation',
        'status',
        'address',
        'pic_name',
        'pic_phone',
        'created_by',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'elevation' => 'integer',
        ];
    }
}
