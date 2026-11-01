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
        $hthRecords = \App\Models\HthData::where('region_name', 'Bone Bolango')->get();
        $avgHth = $hthRecords->count() > 0 ? round($hthRecords->avg('days_without_rain')) : 3;
        $maxHth = $hthRecords->count() > 0 ? $hthRecords->max('days_without_rain') : 5;
        $cat = \App\Models\HthData::determineCategory($avgHth);

        $hthSummary = [
            'days' => $avgHth,
            'maxDays' => $maxHth,
            'category' => $cat['category'],
            'label' => $cat['label'],
            'dasarian' => $hthRecords->first()?->dasarian ?? 'II',
            'month' => $hthRecords->first()?->month ?? 'September',
            'year' => $hthRecords->first()?->year ?? 2026,
        ];

        $latestBulletins = \App\Models\Bulletin::where('is_published', true)->latest('published_date')->take(3)->get();

        return Inertia::render('Public/Beranda', [
            'dbWarning' => $warning,
            'dbHthSummary' => $hthSummary,
            'dbLatestBulletins' => $latestBulletins,
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
        $hth = \App\Models\HthData::orderByRaw("FIELD(region_name, 'Bone Bolango', 'Gorontalo')")->orderBy('district_name')->get();
        $bulletins = \App\Models\Bulletin::where('is_published', true)->latest('published_date')->get();
        return Inertia::render('Public/Iklim', [
            'dbHth' => $hth,
            'dbBulletins' => $bulletins,
        ]);
    }

    public function gempa(): Response
    {
        $localEarthquakes = \App\Models\LocalEarthquake::published()
            ->with(['creator', 'updater'])
            ->latest('event_time')
            ->paginate(10);

        $latestLocal = \App\Models\LocalEarthquake::published()
            ->latest('event_time')
            ->first();

        return Inertia::render('Public/Gempa', [
            'dbLocalEarthquakes' => $localEarthquakes,
            'dbLatestLocal' => $latestLocal,
        ]);
    }

    public function layanan(): Response
    {
        return Inertia::render('Public/Layanan');
    }

    public function apiGempaTerkini()
    {
        return Cache::remember('bmkg_autogempa', 30, function () {
            // 1. Cek data gempa lokal terbaru yang memiliki M >= 5.0
            $latestLocalMajor = \App\Models\LocalEarthquake::published()
                ->where('magnitude', '>=', 5.0)
                ->latest('event_time')
                ->first();

            $nationalGempa = null;
            try {
                $response = Http::timeout(6)->withoutVerifying()->get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
                if ($response->successful()) {
                    $json = $response->json();
                    $nationalGempa = $json['Infogempa']['gempa'] ?? null;
                }
            } catch (\Exception $e) {
                // Biarkan $nationalGempa null jika server BMKG pusat timeout
            }

            // Jika ada gempa lokal M >= 5.0, bandingkan waktu mana yang paling baru
            if ($latestLocalMajor) {
                $localTs = $latestLocalMajor->event_time->getTimestamp();
                $nationalTs = 0;

                if ($nationalGempa) {
                    if (!empty($nationalGempa['DateTime'])) {
                        $nationalTs = \Carbon\Carbon::parse($nationalGempa['DateTime'])->getTimestamp();
                    } elseif (!empty($nationalGempa['Tanggal']) && !empty($nationalGempa['Jam'])) {
                        $cleanJam = trim(str_replace(['WIB', 'WITA', 'WIT'], '', $nationalGempa['Jam']));
                        $nationalTs = \Carbon\Carbon::parse($nationalGempa['Tanggal'] . ' ' . $cleanJam, 'Asia/Jakarta')->getTimestamp();
                    }
                }

                // Jika gempa lokal M >= 5.0 lebih baru daripada gempa nasional M >= 5.0 (atau API nasional tidak tersedia)
                if ($localTs > $nationalTs || !$nationalGempa) {
                    $eventWita = $latestLocalMajor->event_time->copy()->setTimezone('Asia/Makassar');
                    return response()->json([
                        'Infogempa' => [
                            'gempa' => [
                                'Tanggal' => $eventWita->translatedFormat('d M Y'),
                                'Jam' => $eventWita->format('H:i:s') . ' WITA',
                                'DateTime' => $eventWita->toIso8601String(),
                                'Coordinates' => "{$latestLocalMajor->latitude}, {$latestLocalMajor->longitude}",
                                'Lintang' => $latestLocalMajor->latitude,
                                'Bujur' => $latestLocalMajor->longitude,
                                'Magnitude' => number_format($latestLocalMajor->magnitude, 1, '.', ''),
                                'Kedalaman' => "{$latestLocalMajor->depth_km} km",
                                'Wilayah' => $latestLocalMajor->epicenter_location,
                                'Potensi' => $latestLocalMajor->tsunami_potential,
                                'Dirasakan' => $latestLocalMajor->felt_scale_mmi ?: 'Wilayah Gorontalo & Bone Bolango',
                                'Shakemap' => $latestLocalMajor->shakemap_image,
                                'is_local' => true,
                                'source_label' => 'Staklim BMKG Bone Bolango',
                            ]
                        ]
                    ]);
                }
            }

            // Jika gempa nasional lebih baru atau tidak ada gempa lokal M >= 5.0
            if ($nationalGempa) {
                $nationalGempa['is_local'] = false;
                $nationalGempa['source_label'] = 'Pusat Gempabumi BMKG (InaTEWS)';
                return response()->json([
                    'Infogempa' => [
                        'gempa' => $nationalGempa
                    ]
                ]);
            }

            return response()->json(['error' => 'Data gempa terkini tidak tersedia'], 502);
        });
    }

    public function apiGempaKatalog()
    {
        return Cache::remember('bmkg_katalog_gempa', 30, function () {
            $nationalList = [];
            try {
                $response = Http::timeout(6)->withoutVerifying()->get('https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json');
                if ($response->successful()) {
                    $json = $response->json();
                    $nationalList = $json['Infogempa']['gempa'] ?? [];
                }
            } catch (\Exception $e) {
                // Biarkan list nasional kosong jika timeout
            }

            // Ambil data gempa lokal M >= 5.0
            $localMajor = \App\Models\LocalEarthquake::published()
                ->where('magnitude', '>=', 5.0)
                ->latest('event_time')
                ->take(10)
                ->get();

            $formattedLocal = [];
            foreach ($localMajor as $leq) {
                $eventWita = $leq->event_time->copy()->setTimezone('Asia/Makassar');
                $formattedLocal[] = [
                    'Tanggal' => $eventWita->translatedFormat('d M Y'),
                    'Jam' => $eventWita->format('H:i:s') . ' WITA',
                    'DateTime' => $eventWita->toIso8601String(),
                    'Coordinates' => "{$leq->latitude}, {$leq->longitude}",
                    'Lintang' => $leq->latitude,
                    'Bujur' => $leq->longitude,
                    'Magnitude' => number_format($leq->magnitude, 1, '.', ''),
                    'Kedalaman' => "{$leq->depth_km} km",
                    'Wilayah' => $leq->epicenter_location,
                    'Potensi' => $leq->tsunami_potential,
                    'Dirasakan' => $leq->felt_scale_mmi ?: '-',
                    'Shakemap' => $leq->shakemap_image,
                    'is_local' => true,
                    'source_label' => 'Lokal Staklim Bone Bolango',
                ];
            }

            // Gabungkan data lokal dan nasional, urutkan berdasarkan waktu kejadian terbaru
            $merged = array_merge($formattedLocal, array_map(function ($item) {
                $item['is_local'] = false;
                $item['source_label'] = 'BMKG Pusat (InaTEWS)';
                return $item;
            }, $nationalList));

            usort($merged, function ($a, $b) {
                $timeA = isset($a['DateTime']) ? strtotime($a['DateTime']) : 0;
                $timeB = isset($b['DateTime']) ? strtotime($b['DateTime']) : 0;
                return $timeB <=> $timeA;
            });

            return response()->json([
                'Infogempa' => [
                    'gempa' => array_slice($merged, 0, 15)
                ]
            ]);
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

    public function apiGempaLokal()
    {
        return Cache::remember('bmkg_gempa_lokal_list', 30, function () {
            $earthquakes = \App\Models\LocalEarthquake::published()
                ->latest('event_time')
                ->take(20)
                ->get();

            return response()->json([
                'status' => 'success',
                'source' => 'Stasiun Klimatologi BMKG Bone Bolango',
                'total' => $earthquakes->count(),
                'data' => $earthquakes,
            ]);
        });
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

    public function apiCuaca()
    {
        return Cache::remember('bmkg_cuaca_gorontalo', 1800, function () {
            try {
                $res = Http::timeout(8)->withoutVerifying()->get('https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=75.71.01.1001');
                if ($res->successful()) {
                    return response()->json($res->json());
                }
                return response()->json(['status' => 'fallback'], 200);
            } catch (\Exception $e) {
                return response()->json(['status' => 'fallback', 'message' => $e->getMessage()], 200);
            }
        });
    }

    public function submitIkm(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'respondent_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:30',
            'service_type' => 'required|string|max:150',
            'q1_persyaratan' => 'required|integer|min:1|max:4',
            'q2_prosedur' => 'required|integer|min:1|max:4',
            'q3_waktu' => 'required|integer|min:1|max:4',
            'q4_biaya' => 'required|integer|min:1|max:4',
            'q5_produk' => 'required|integer|min:1|max:4',
            'q6_kompetensi' => 'required|integer|min:1|max:4',
            'q7_perilaku' => 'required|integer|min:1|max:4',
            'q8_sarana' => 'required|integer|min:1|max:4',
            'q9_pengaduan' => 'required|integer|min:1|max:4',
            'feedback' => 'nullable|string|max:1000',
        ]);

        $sum = $validated['q1_persyaratan'] +
               $validated['q2_prosedur'] +
               $validated['q3_waktu'] +
               $validated['q4_biaya'] +
               $validated['q5_produk'] +
               $validated['q6_kompetensi'] +
               $validated['q7_perilaku'] +
               $validated['q8_sarana'] +
               $validated['q9_pengaduan'];

        $scoreTotal = round(($sum / 36) * 100, 2);

        $survey = \App\Models\IkmSurvey::create(array_merge($validated, [
            'score_total' => $scoreTotal,
            'ip_address' => $request->ip(),
        ]));

        \App\Models\AuditLog::log(
            'SURVEI_IKM_ONLINE',
            'IKM',
            "Survei kepuasan masyarakat (IKM) baru dikirim oleh {$survey->respondent_name} ({$survey->service_type}) dengan skor {$scoreTotal}."
        );

        return redirect()->back()->with([
            'success_ikm' => 'Terima kasih! Survei kepuasan Anda berhasil dicatat dan masuk ke database sistem kami.',
            'ikm_score' => $scoreTotal,
        ]);
    }
}

