<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\Bulletin;
use App\Models\EarlyWarning;
use App\Models\HthData;
use App\Models\IkmSurvey;
use App\Models\PosHujan;
use App\Models\PtspTicket;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $superadmin = User::firstOrCreate(
            ['email' => 'superadmin@bmkg.go.id'],
            [
                'name' => 'Superadmin',
                'password' => Hash::make('password123'),
                'role' => 'superadmin',
                'nip' => '198501012010011001',
                'jabatan' => 'Administrator Utama Sistem',
                'gender' => 'laki-laki',
                'avatar' => 'avatar_pria_1.svg',
                'phone' => '081100000001',
                'is_active' => true,
            ]
        );

        $admin = User::firstOrCreate(
            ['email' => 'admin@bmkg.go.id'],
            [
                'name' => 'Admin Data & Informasi',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'nip' => '198802022012011002',
                'jabatan' => 'Koordinator Data & Informasi',
                'gender' => 'laki-laki',
                'avatar' => 'avatar_pria_2.svg',
                'phone' => '081100000002',
                'is_active' => true,
            ]
        );

        $staf = User::firstOrCreate(
            ['email' => 'staf@bmkg.go.id'],
            [
                'name' => 'Staf Observasi Klimatologi',
                'password' => Hash::make('password123'),
                'role' => 'staf',
                'nip' => '199403032018011003',
                'jabatan' => 'Petugas Observasi & Analisis',
                'gender' => 'perempuan',
                'avatar' => 'avatar_wanita_1.svg',
                'phone' => '081100000003',
                'is_active' => true,
            ]
        );

        EarlyWarning::firstOrCreate(
            ['title' => 'Status Cuaca Normal - Tidak Ada Peringatan Dini Ekstrem'],
            [
                'level' => 'normal',
                'description' => 'Kondisi atmosfer di wilayah Kabupaten Bone Bolango dan sekitarnya terpantau kondusif. Tetap pantau pembaruan berkala dari BMKG.',
                'affected_areas' => ['Kabupaten Bone Bolango', 'Kota Gorontalo', 'Kabupaten Gorontalo'],
                'issued_at' => date('d F Y') . ' 07:00 WITA',
                'valid_until' => '24 Jam ke Depan',
                'is_active' => true,
                'updated_by' => $admin->id,
            ]
        );

        $districts = [
            ['region' => 'Bone Bolango', 'district' => 'Suwawa (Ibukota)', 'days' => 3],
            ['region' => 'Bone Bolango', 'district' => 'Kabila', 'days' => 4],
            ['region' => 'Bone Bolango', 'district' => 'Tilongkabila', 'days' => 2],
            ['region' => 'Bone Bolango', 'district' => 'Tapa', 'days' => 5],
            ['region' => 'Bone Bolango', 'district' => 'Botupingge', 'days' => 7],
            ['region' => 'Bone Bolango', 'district' => 'Bonepantai', 'days' => 12],
            ['region' => 'Bone Bolango', 'district' => 'Kabila Bone', 'days' => 6],
            ['region' => 'Bone Bolango', 'district' => 'Bone', 'days' => 9],
            ['region' => 'Bone Bolango', 'district' => 'Bulango Selatan', 'days' => 3],
            ['region' => 'Bone Bolango', 'district' => 'Bulango Timur', 'days' => 4],
            ['region' => 'Bone Bolango', 'district' => 'Bulango Ulu', 'days' => 1],
            ['region' => 'Bone Bolango', 'district' => 'Bulango Utara', 'days' => 2],
            ['region' => 'Bone Bolango', 'district' => 'Suwawa Timur', 'days' => 3],
            ['region' => 'Bone Bolango', 'district' => 'Suwawa Tengah', 'days' => 4],
            ['region' => 'Bone Bolango', 'district' => 'Suwawa Selatan', 'days' => 5],
            ['region' => 'Bone Bolango', 'district' => 'Pinogu (Dataran Tinggi)', 'days' => 0],
            ['region' => 'Gorontalo', 'district' => 'Kota Gorontalo', 'days' => 4],
            ['region' => 'Gorontalo', 'district' => 'Kabupaten Gorontalo (Limboto)', 'days' => 5],
            ['region' => 'Gorontalo', 'district' => 'Gorontalo Utara (Kwandang)', 'days' => 8],
            ['region' => 'Gorontalo', 'district' => 'Boalemo (Tilamuta)', 'days' => 6],
            ['region' => 'Gorontalo', 'district' => 'Pohuwato (Marisa)', 'days' => 14],
        ];

        foreach ($districts as $d) {
            $cat = HthData::determineCategory($d['days']);
            HthData::firstOrCreate(
                [
                    'region_name' => $d['region'],
                    'district_name' => $d['district'],
                    'dasarian' => 'II',
                    'month' => 'September',
                    'year' => 2026,
                ],
                [
                    'days_without_rain' => $d['days'],
                    'risk_category' => $cat['category'],
                    'status_label' => $cat['label'],
                    'observation_date' => date('Y-m-d'),
                    'updated_by' => $staf->id,
                ]
            );
        }

        $bulletins = [
            [
                'title' => 'Buletin Informasi Iklim Provinsi Gorontalo - Edisi September 2026',
                'edition' => 'September 2026',
                'category' => 'buletin',
                'file_size' => '3.4 MB',
                'file_type' => 'PDF',
                'download_url' => '#',
                'published_date' => '2026-09-15',
                'summary' => 'Analisis curah hujan bulan Agustus 2026 dan prakiraan hujan bulan Oktober - Desember 2026 wilayah Gorontalo.',
            ],
            [
                'title' => 'Peta Prakiraan Awal Musim Hujan 2026/2027 Wilayah Gorontalo',
                'edition' => 'Prakiraan 2026/2027',
                'category' => 'peta',
                'file_size' => '4.8 MB',
                'file_type' => 'PNG',
                'download_url' => '#',
                'published_date' => '2026-09-01',
                'summary' => 'Sebaran spasial zona musim (ZOM) awal musim hujan di wilayah Kabupaten Bone Bolango dan sekitarnya.',
            ],
            [
                'title' => 'Data Curah Hujan Bulanan Stasiun Pos Hujan Bone Bolango Tahun 2025',
                'edition' => 'Tahun 2025',
                'category' => 'laporan',
                'file_size' => '1.2 MB',
                'file_type' => 'XLSX',
                'download_url' => '#',
                'published_date' => '2026-01-10',
                'summary' => 'Rekapitulasi statistik curah hujan dan hari hujan tahunan dari 15 titik pos pengamatan.',
            ],
            [
                'title' => 'Buletin Informasi Iklim Provinsi Gorontalo - Edisi Agustus 2026',
                'edition' => 'Agustus 2026',
                'category' => 'buletin',
                'file_size' => '3.1 MB',
                'file_type' => 'PDF',
                'download_url' => '#',
                'published_date' => '2026-08-15',
                'summary' => 'Evaluasi kondisi ENSO Netral dan dinamika iklim musim kemarau di Gorontalo.',
            ],
        ];

        foreach ($bulletins as $b) {
            Bulletin::firstOrCreate(
                ['title' => $b['title']],
                array_merge($b, ['uploaded_by' => $admin->id, 'is_published' => true])
            );
        }

        $posStations = [
            ['name' => 'Stasiun Klimatologi Gorontalo (Moutong)', 'code' => 'STAKLIM-96119', 'district' => 'Tilongkabila', 'type' => 'OBS', 'lat' => 0.553900, 'lng' => 123.153400, 'elev' => 25, 'status' => 'aktif', 'address' => 'Jl. Prof. B.J. Habibie, Moutong'],
            ['name' => 'Pos Hujan Kerjasama BPP Suwawa', 'code' => 'POS-SWW-01', 'district' => 'Suwawa', 'type' => 'OBS', 'lat' => 0.548200, 'lng' => 123.168500, 'elev' => 30, 'status' => 'aktif', 'address' => 'Balai Penyuluhan Pertanian Suwawa'],
            ['name' => 'Pos Hujan Kerjasama Kabila', 'code' => 'POS-KBL-02', 'district' => 'Kabila', 'type' => 'HELLMAN', 'lat' => 0.541100, 'lng' => 123.112300, 'elev' => 18, 'status' => 'aktif', 'address' => 'Kantor Camat Kabila'],
            ['name' => 'Automatic Weather Station (AWS) Tapa', 'code' => 'AWS-TPA-03', 'district' => 'Tapa', 'type' => 'AWS', 'lat' => 0.589200, 'lng' => 123.101200, 'elev' => 35, 'status' => 'aktif', 'address' => 'Kecamatan Tapa'],
            ['name' => 'Pos Hujan Botupingge', 'code' => 'POS-BTP-04', 'district' => 'Botupingge', 'type' => 'OBS', 'lat' => 0.512000, 'lng' => 123.134500, 'elev' => 45, 'status' => 'kalibrasi', 'address' => 'Desa Timbuolo'],
            ['name' => 'Automatic Rain Gauge (ARG) Bonepantai', 'code' => 'ARG-BPT-05', 'district' => 'Bonepantai', 'type' => 'ARG', 'lat' => 0.467800, 'lng' => 123.245600, 'elev' => 12, 'status' => 'aktif', 'address' => 'Pesisir Pantai Bilungala'],
            ['name' => 'Pos Hujan DAS Bulango Ulu', 'code' => 'POS-BLU-06', 'district' => 'Bulango Ulu', 'type' => 'OBS', 'lat' => 0.672100, 'lng' => 123.189000, 'elev' => 110, 'status' => 'aktif', 'address' => 'Kawasan Hulu DAS Bulango'],
            ['name' => 'Pos Hujan Enklave TNBNW Pinogu', 'code' => 'POS-PNG-07', 'district' => 'Pinogu', 'type' => 'OBS', 'lat' => 0.412300, 'lng' => 123.389100, 'elev' => 280, 'status' => 'aktif', 'address' => 'Kawasan Enklave Pinogu'],
        ];

        foreach ($posStations as $pos) {
            PosHujan::firstOrCreate(
                ['code' => $pos['code']],
                [
                    'name' => $pos['name'],
                    'district' => $pos['district'],
                    'type' => $pos['type'],
                    'latitude' => $pos['lat'],
                    'longitude' => $pos['lng'],
                    'elevation' => $pos['elev'],
                    'status' => $pos['status'],
                    'address' => $pos['address'],
                    'pic_name' => 'Staf Staklim BMKG',
                    'pic_phone' => '0435-821234',
                ]
            );
        }

        $tickets = [
            [
                'ticket_number' => 'PTSP-2026-0901',
                'applicant_name' => 'Rahmat Hidayat',
                'institution' => 'Universitas Negeri Gorontalo (UNG)',
                'email' => 'rahmat.ung@gmail.com',
                'phone' => '082199887766',
                'purpose_category' => 'Penelitian Mahasiswa (Tarif 0% Rp 0)',
                'data_requested' => 'Data Curah Hujan Harian Stasiun Bone Bolango periode 2020 - 2025 untuk Skripsi.',
                'date_range' => '2020-01-01 s.d. 2025-12-31',
                'tariff_amount' => 0,
                'is_free_education' => true,
                'status' => 'diproses',
                'admin_notes' => 'Surat pengantar dekan UNG telah terverifikasi valid.',
                'processed_by' => $admin->id,
            ],
            [
                'ticket_number' => 'PTSP-2026-0902',
                'applicant_name' => 'PT. Gorontalo Agro Lestari',
                'institution' => 'PT. Gorontalo Agro Lestari',
                'email' => 'contact@agro-lestari.co.id',
                'phone' => '081143219000',
                'purpose_category' => 'Komersial / Perkebunan (Tarif PNBP)',
                'data_requested' => 'Analisis Hari Tanpa Hujan (HTH) dan Evapotranspirasi Potensial 10 Tahun Terakhir.',
                'date_range' => '2016 - 2025',
                'tariff_amount' => 350000.00,
                'is_free_education' => false,
                'status' => 'menunggu',
                'admin_notes' => 'Menunggu konfirmasi pembayaran billing SIMPONI PNBP.',
                'processed_by' => null,
            ],
            [
                'ticket_number' => 'PTSP-2026-0819',
                'applicant_name' => 'Dinas Pekerjaan Umum Kab. Bone Bolango',
                'institution' => 'Dinas PU & Penataan Ruang Bone Bolango',
                'email' => 'bidang.sda@bonebolangokab.go.id',
                'phone' => '0435-829911',
                'purpose_category' => 'Instansi Pemerintah Daerah (Tarif 0% Rp 0)',
                'data_requested' => 'Data Intensitas Hujan Ekstrem DAS Bone Bolango untuk Desain Tanggul Pengendali Banjir.',
                'date_range' => '2015 - 2025',
                'tariff_amount' => 0,
                'is_free_education' => true,
                'status' => 'selesai',
                'admin_notes' => 'Data format CSV telah dikirimkan via email resmi dinas.',
                'processed_by' => $admin->id,
            ],
        ];

        foreach ($tickets as $t) {
            PtspTicket::firstOrCreate(['ticket_number' => $t['ticket_number']], $t);
        }

        $surveys = [
            ['respondent_name' => 'Rahmat Hidayat', 'email' => 'rahmat.ung@gmail.com', 'service_type' => 'Permintaan Data Penelitian', 'score_total' => 96.5, 'feedback' => 'Pelayanan cepat dan ramah, surat pengantar langsung diproses tanpa berbelit-belit.'],
            ['respondent_name' => 'Siti Nurhaliza', 'email' => 'siti.nur@gmail.com', 'service_type' => 'Konsultasi Informasi Iklim', 'score_total' => 92.0, 'feedback' => 'Petugas sangat menguasai data dan penjelasan grafik iklim mudah dipahami.'],
            ['respondent_name' => 'Ir. Hendro Wijaya', 'email' => 'hendro.pu@gmail.com', 'service_type' => 'Data Desain DAS Hidrologi', 'score_total' => 94.0, 'feedback' => 'Sangat membantu perencanaan infrastruktur daerah Bone Bolango.'],
        ];

        foreach ($surveys as $s) {
            IkmSurvey::firstOrCreate(
                ['email' => $s['email']],
                array_merge($s, [
                    'q1_persyaratan' => 4,
                    'q2_prosedur' => 4,
                    'q3_waktu' => 4,
                    'q4_biaya' => 4,
                    'q5_produk' => 4,
                    'q6_kompetensi' => 4,
                    'q7_perilaku' => 4,
                    'q8_sarana' => 4,
                    'q9_pengaduan' => 4,
                    'ip_address' => '127.0.0.1',
                ])
            );
        }

        AuditLog::create([
            'user_id' => $superadmin->id,
            'user_name' => $superadmin->name,
            'user_role' => 'superadmin',
            'action' => 'INITIAL_SEED',
            'module' => 'SISTEM',
            'description' => 'Inisialisasi sistem database portal Stasiun Klimatologi BMKG Bone Bolango.',
            'ip_address' => '127.0.0.1',
            'user_agent' => 'BMKG Portal Seeder/1.0',
        ]);
    }
}
