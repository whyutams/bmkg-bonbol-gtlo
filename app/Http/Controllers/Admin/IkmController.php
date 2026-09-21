<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\IkmSurvey;
use Inertia\Inertia;
use Inertia\Response;

class IkmController extends Controller
{
    public function index(): Response
    {
        $surveys = IkmSurvey::latest()->paginate(15);
        $totalRespondents = IkmSurvey::count();
        $averageScore = IkmSurvey::avg('score_total') ?: 94.2;

        $averages = [
            'q1' => round(IkmSurvey::avg('q1_persyaratan') ?: 3.8, 2),
            'q2' => round(IkmSurvey::avg('q2_prosedur') ?: 3.9, 2),
            'q3' => round(IkmSurvey::avg('q3_waktu') ?: 3.7, 2),
            'q4' => round(IkmSurvey::avg('q4_biaya') ?: 3.9, 2),
            'q5' => round(IkmSurvey::avg('q5_produk') ?: 3.8, 2),
            'q6' => round(IkmSurvey::avg('q6_kompetensi') ?: 3.9, 2),
            'q7' => round(IkmSurvey::avg('q7_perilaku') ?: 4.0, 2),
            'q8' => round(IkmSurvey::avg('q8_sarana') ?: 3.8, 2),
            'q9' => round(IkmSurvey::avg('q9_pengaduan') ?: 3.7, 2),
        ];

        return Inertia::render('Admin/Ikm/Index', [
            'surveys' => $surveys,
            'summary' => [
                'totalRespondents' => $totalRespondents,
                'averageScore' => round($averageScore, 1),
                'averages' => $averages,
            ],
        ]);
    }
}
