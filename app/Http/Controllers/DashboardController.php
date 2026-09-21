<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Bulletin;
use App\Models\EarlyWarning;
use App\Models\HthData;
use App\Models\IkmSurvey;
use App\Models\PosHujan;
use App\Models\PtspTicket;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $warning = EarlyWarning::where('is_active', true)->latest()->first();
        $totalPos = PosHujan::count();
        $activePos = PosHujan::where('status', 'aktif')->count();
        $totalBulletins = Bulletin::count();
        $latestBulletin = Bulletin::latest('published_date')->first();

        $ticketsQuery = PtspTicket::query();
        $totalTickets = $ticketsQuery->count();
        $pendingTickets = PtspTicket::where('status', 'menunggu')->count();
        $processingTickets = PtspTicket::where('status', 'diproses')->count();
        $completedTickets = PtspTicket::where('status', 'selesai')->count();
        $recentTickets = PtspTicket::latest()->take(5)->get();

        $ikmAvg = IkmSurvey::avg('score_total') ?: 94.2;
        $totalIkm = IkmSurvey::count();

        $recentHth = HthData::where('region_name', 'Bone Bolango')->orderBy('days_without_rain', 'desc')->take(6)->get();
        $recentLogs = AuditLog::latest()->take(6)->get();
        $totalUsers = User::count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'warning' => $warning,
                'posHujan' => [
                    'total' => $totalPos,
                    'active' => $activePos,
                ],
                'bulletins' => [
                    'total' => $totalBulletins,
                    'latest' => $latestBulletin,
                ],
                'tickets' => [
                    'total' => $totalTickets,
                    'pending' => $pendingTickets,
                    'processing' => $processingTickets,
                    'completed' => $completedTickets,
                ],
                'ikm' => [
                    'average' => round($ikmAvg, 1),
                    'totalRespondents' => $totalIkm,
                ],
                'totalUsers' => $totalUsers,
            ],
            'recentTickets' => $recentTickets,
            'recentHth' => $recentHth,
            'recentLogs' => $recentLogs,
        ]);
    }
}
