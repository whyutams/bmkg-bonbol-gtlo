<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class PortalController extends Controller
{
    public function beranda(): Response
    {
        $warning = \App\Models\EarlyWarning::where('is_active', true)->latest()->first();
        return Inertia::render('Public/Beranda', [
            'dbWarning' => $warning,
        ]);
    }

    public function profil(): Response
    {
        $stations = \App\Models\PosHujan::all();
        $staff = \App\Models\User::where('is_active', true)
            ->orderByRaw("FIELD(role, 'superadmin', 'admin', 'staf')")
            ->orderBy('name')
            ->get();

        return Inertia::render('Public/Profil', [
            'dbStations' => $stations,
            'staffMembers' => $staff,
        ]);
    }

    public function cuaca(): Response
    {
        return Inertia::render('Public/Cuaca');
    }

    public function iklim(): Response
    {
        $hth = \App\Models\HthData::where('dasarian', 'II')->where('month', 'September')->where('year', 2026)->get();
        $bulletins = \App\Models\Bulletin::where('is_published', true)->latest('published_date')->get();
        return Inertia::render('Public/Iklim', [
            'dbHth' => $hth,
            'dbBulletins' => $bulletins,
        ]);
    }

    public function gempa(): Response
    {
        return Inertia::render('Public/Gempa');
    }

    public function layanan(): Response
    {
        return Inertia::render('Public/Layanan');
    }

    public function apiGempaTerkini()
    {
        return Cache::remember('bmkg_autogempa', 60, function () {
            try {
                $response = Http::timeout(6)->withoutVerifying()->get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
                if ($response->successful()) {
                    return response()->json($response->json());
                }
                return response()->json(['error' => 'Gagal mengambil data dari server BMKG'], 502);
            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'Koneksi ke server BMKG TEWS terputus',
                    'message' => $e->getMessage()
                ], 500);
            }
        });
    }

    public function apiGempaKatalog()
    {
        return Cache::remember('bmkg_katalog_gempa', 60, function () {
            try {
                $response = Http::timeout(6)->withoutVerifying()->get('https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json');
                if ($response->successful()) {
                    return response()->json($response->json());
                }
                return response()->json(['error' => 'Gagal mengambil katalog gempa dari server BMKG'], 502);
            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'Koneksi ke server BMKG TEWS terputus',
                    'message' => $e->getMessage()
                ], 500);
            }
        });
    }

    public function apiGempaDirasakan()
    {
        return Cache::remember('bmkg_gempa_dirasakan', 60, function () {
            try {
                $response = Http::timeout(6)->withoutVerifying()->get('https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json');
                if ($response->successful()) {
                    return response()->json($response->json());
                }
                return response()->json(['error' => 'Gagal mengambil gempa dirasakan dari server BMKG'], 502);
            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'Koneksi ke server BMKG TEWS terputus',
                    'message' => $e->getMessage()
                ], 500);
            }
        });
    }

    public function apiShakemap($filename)
    {
        $safeFilename = basename($filename);
        if (!preg_match('/^[a-zA-Z0-9_\-\.]+\.(jpg|jpeg|png|webp)$/i', $safeFilename)) {
            return response()->json(['error' => 'File tidak valid'], 400);
        }

        $cached = Cache::remember('bmkg_shakemap_' . $safeFilename, 3600, function () use ($safeFilename) {
            try {
                $res = Http::timeout(10)->withoutVerifying()->get("https://data.bmkg.go.id/DataMKG/TEWS/{$safeFilename}");
                if ($res->successful()) {
                    return [
                        'type' => $res->header('Content-Type') ?: 'image/jpeg',
                        'data' => base64_encode($res->body()),
                    ];
                }
                return null;
            } catch (\Exception $e) {
                return null;
            }
        });

        if (!$cached) {
            return response()->json(['error' => 'Gambar shakemap tidak ditemukan'], 404);
        }

        return response(base64_decode($cached['data']))
            ->header('Content-Type', $cached['type'])
            ->header('Cache-Control', 'public, max-age=3600');
    }

    public function submitPtsp(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'applicant_name' => 'required|string|max:255',
            'institution' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:30',
            'purpose_category' => 'required|string|max:100',
            'data_requested' => 'required|string|max:255',
            'date_range' => 'nullable|string|max:100',
            'admin_notes' => 'nullable|string',
        ]);

        $ticketNumber = 'PTSP-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));

        $ticket = \App\Models\PtspTicket::create([
            'ticket_number' => $ticketNumber,
            'applicant_name' => $validated['applicant_name'],
            'institution' => $validated['institution'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'purpose_category' => $validated['purpose_category'],
            'data_requested' => $validated['data_requested'],
            'date_range' => $validated['date_range'] ?? date('Y'),
            'status' => 'menunggu',
            'tariff_amount' => (str_contains(strtolower($validated['purpose_category']), 'mahasiswa') || str_contains(strtolower($validated['purpose_category']), 'pendidikan')) ? 0 : 150000,
            'is_free_education' => str_contains(strtolower($validated['purpose_category']), 'mahasiswa') || str_contains(strtolower($validated['purpose_category']), 'pendidikan'),
            'admin_notes' => $validated['admin_notes'] ?? 'Pengajuan online via portal web resmi.',
        ]);

        \App\Models\AuditLog::log(
            'PERMOHONAN_PTSP_ONLINE',
            'PTSP',
            "Permohonan data klimatologi baru diajukan secara online dengan tiket {$ticketNumber} oleh {$ticket->applicant_name} ({$ticket->institution})."
        );

        return redirect()->back()->with([
            'success' => 'Permohonan berhasil dikirim ke loket PTSP BMKG Bone Bolango!',
            'ticket_number' => $ticketNumber,
        ]);
    }
}

