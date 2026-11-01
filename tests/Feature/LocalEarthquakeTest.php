<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\LocalEarthquake;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LocalEarthquakeTest extends TestCase
{
    public function test_public_gempa_page_displays_local_earthquakes(): void
    {
        $response = $this->get('/gempa');
        $response->assertStatus(200);
        $response->assertSee('Bone Bolango');
    }

    public function test_api_gempa_lokal_returns_json(): void
    {
        $response = $this->getJson('/api/bmkg/gempa-lokal');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'source',
                'total',
                'data',
            ]);
    }

    public function test_guest_cannot_access_admin_local_earthquakes(): void
    {
        $response = $this->get('/admin/local-earthquakes');
        $response->assertRedirect('/login');
    }

    public function test_admin_can_access_local_earthquakes_index(): void
    {
        $admin = User::where('role', 'admin')->first() ?? User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/admin/local-earthquakes');
        $response->assertStatus(200);
    }

    public function test_admin_can_store_update_and_delete_local_earthquake(): void
    {
        $admin = User::where('role', 'admin')->first() ?? User::factory()->create(['role' => 'admin']);

        // 1. Store
        $storeResponse = $this->actingAs($admin)->post('/admin/local-earthquakes', [
            'event_time' => '2026-11-01 10:15:00',
            'magnitude' => 3.4,
            'depth_km' => 12,
            'latitude' => '0.45 LU',
            'longitude' => '123.20 BT',
            'epicenter_location' => '8 km Barat Daya Kabila, Bone Bolango',
            'felt_scale_mmi' => 'II MMI Kabila',
            'tsunami_potential' => 'Tidak Berpotensi TSUNAMI',
            'notes' => 'Uji coba penambahan gempa lokal dari automated test.',
            'is_published' => true,
        ]);

        $storeResponse->assertSessionHas('success');

        $earthquake = LocalEarthquake::where('epicenter_location', '8 km Barat Daya Kabila, Bone Bolango')->first();
        $this->assertNotNull($earthquake);
        $this->assertEquals(3.4, $earthquake->magnitude);

        // Verify Audit Log
        $this->assertTrue(
            AuditLog::where('action', 'TAMBAH_GEMPA_LOKAL')->where('module', 'GEMPA')->exists()
        );

        // 2. Update
        $updateResponse = $this->actingAs($admin)->put("/admin/local-earthquakes/{$earthquake->id}", [
            'event_time' => '2026-11-01 10:15:00',
            'magnitude' => 3.7,
            'depth_km' => 15,
            'latitude' => '0.45 LU',
            'longitude' => '123.20 BT',
            'epicenter_location' => '8 km Barat Daya Kabila, Bone Bolango (Updated)',
            'felt_scale_mmi' => 'II-III MMI Kabila',
            'tsunami_potential' => 'Tidak Berpotensi TSUNAMI',
            'notes' => 'Diperbarui melalui automated test.',
            'is_published' => true,
        ]);

        $updateResponse->assertSessionHas('success');
        $earthquake->refresh();
        $this->assertEquals(3.7, $earthquake->magnitude);
        $this->assertEquals($admin->id, $earthquake->updated_by);

        // 3. Delete
        $deleteResponse = $this->actingAs($admin)->delete("/admin/local-earthquakes/{$earthquake->id}");
        $deleteResponse->assertSessionHas('success');

        $this->assertNull(LocalEarthquake::find($earthquake->id));
        $this->assertTrue(
            AuditLog::where('action', 'HAPUS_GEMPA_LOKAL')->where('module', 'GEMPA')->exists()
        );
    }

    public function test_gempa_terkini_returns_local_when_local_major_is_newer(): void
    {
        $admin = User::where('role', 'admin')->first() ?? User::factory()->create(['role' => 'admin']);

        // Buat gempa lokal M >= 5.0 dengan waktu terbaru
        $localMajor = LocalEarthquake::create([
            'event_time' => now()->addMinutes(10),
            'magnitude' => 5.6,
            'depth_km' => 10,
            'latitude' => '0.45 LU',
            'longitude' => '123.15 BT',
            'epicenter_location' => 'Pusat gempa lokal 5 km Timur Suwawa',
            'felt_scale_mmi' => 'IV-V MMI Suwawa',
            'tsunami_potential' => 'Tidak Berpotensi TSUNAMI',
            'is_published' => true,
            'created_by' => $admin->id,
        ]);

        \Illuminate\Support\Facades\Cache::forget('bmkg_autogempa');

        $response = $this->getJson('/api/bmkg/gempa-terkini');
        $response->assertStatus(200);

        $gempa = $response->json('Infogempa.gempa');
        $this->assertTrue($gempa['is_local']);
        $this->assertEquals('5.6', $gempa['Magnitude']);
        $this->assertEquals('Pusat gempa lokal 5 km Timur Suwawa', $gempa['Wilayah']);

        $localMajor->delete();
        \Illuminate\Support\Facades\Cache::forget('bmkg_autogempa');
    }
}
