<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\LocalEarthquake;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class LocalEarthquakeController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $query = LocalEarthquake::with(['creator', 'updater'])->latest('event_time');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('epicenter_location', 'like', "%{$search}%")
                    ->orWhere('felt_scale_mmi', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%")
                    ->orWhere('tsunami_potential', 'like', "%{$search}%");
            });
        }

        $earthquakes = $query->paginate(10)->withQueryString();

        $stats = [
            'total' => LocalEarthquake::count(),
            'this_month' => LocalEarthquake::whereMonth('event_time', now()->month)
                ->whereYear('event_time', now()->year)
                ->count(),
            'felt_count' => LocalEarthquake::whereNotNull('felt_scale_mmi')
                ->where('felt_scale_mmi', '!=', '')
                ->count(),
        ];

        return Inertia::render('Admin/LocalEarthquakes/Index', [
            'earthquakes' => $earthquakes,
            'filters' => [
                'search' => $search,
            ],
            'stats' => $stats,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'event_time' => 'required|date',
            'magnitude' => 'required|numeric|min:0.1|max:10.0',
            'depth_km' => 'required|integer|min:1|max:1000',
            'latitude' => 'required|string|max:30',
            'longitude' => 'required|string|max:30',
            'epicenter_location' => 'required|string|max:255',
            'felt_scale_mmi' => 'nullable|string|max:255',
            'tsunami_potential' => 'required|string|max:100',
            'shakemap_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'notes' => 'nullable|string',
            'is_published' => 'nullable|boolean',
        ]);

        $imagePath = null;
        if ($request->hasFile('shakemap_image')) {
            $imagePath = $request->file('shakemap_image')->store('local_earthquakes', 'public');
        }

        $eventTime = \Carbon\Carbon::parse($validated['event_time'], 'Asia/Makassar');

        $earthquake = LocalEarthquake::create([
            'event_time' => $eventTime,
            'magnitude' => $validated['magnitude'],
            'depth_km' => $validated['depth_km'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'epicenter_location' => $validated['epicenter_location'],
            'felt_scale_mmi' => $validated['felt_scale_mmi'] ?? null,
            'tsunami_potential' => $validated['tsunami_potential'] ?? 'Tidak Berpotensi TSUNAMI',
            'shakemap_image' => $imagePath,
            'notes' => $validated['notes'] ?? null,
            'is_published' => $request->boolean('is_published', true),
            'created_by' => auth()->id(),
        ]);

        AuditLog::log(
            'TAMBAH_GEMPA_LOKAL',
            'GEMPA',
            "Menambahkan rekaman gempa lokal M {$earthquake->magnitude} di {$earthquake->epicenter_location}."
        );

        return redirect()->back()->with('success', 'Data gempabumi lokal berhasil ditambahkan.');
    }

    public function update(Request $request, LocalEarthquake $localEarthquake): RedirectResponse
    {
        $validated = $request->validate([
            'event_time' => 'required|date',
            'magnitude' => 'required|numeric|min:0.1|max:10.0',
            'depth_km' => 'required|integer|min:1|max:1000',
            'latitude' => 'required|string|max:30',
            'longitude' => 'required|string|max:30',
            'epicenter_location' => 'required|string|max:255',
            'felt_scale_mmi' => 'nullable|string|max:255',
            'tsunami_potential' => 'required|string|max:100',
            'shakemap_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'notes' => 'nullable|string',
            'is_published' => 'nullable|boolean',
        ]);

        $imagePath = $localEarthquake->shakemap_image;
        if ($request->hasFile('shakemap_image')) {
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('shakemap_image')->store('local_earthquakes', 'public');
        }

        $eventTime = \Carbon\Carbon::parse($validated['event_time'], 'Asia/Makassar');

        $localEarthquake->update([
            'event_time' => $eventTime,
            'magnitude' => $validated['magnitude'],
            'depth_km' => $validated['depth_km'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'epicenter_location' => $validated['epicenter_location'],
            'felt_scale_mmi' => $validated['felt_scale_mmi'] ?? null,
            'tsunami_potential' => $validated['tsunami_potential'] ?? 'Tidak Berpotensi TSUNAMI',
            'shakemap_image' => $imagePath,
            'notes' => $validated['notes'] ?? null,
            'is_published' => $request->boolean('is_published', true),
            'updated_by' => auth()->id(),
        ]);

        AuditLog::log(
            'UPDATE_GEMPA_LOKAL',
            'GEMPA',
            "Memperbarui rekaman gempa lokal ID #{$localEarthquake->id} (M {$localEarthquake->magnitude} di {$localEarthquake->epicenter_location})."
        );

        return redirect()->back()->with('success', 'Data gempabumi lokal berhasil diperbarui.');
    }

    public function destroy(LocalEarthquake $localEarthquake): RedirectResponse
    {
        $desc = "Menghapus rekaman gempa lokal ID #{$localEarthquake->id} (M {$localEarthquake->magnitude} di {$localEarthquake->epicenter_location}).";

        if ($localEarthquake->shakemap_image && Storage::disk('public')->exists($localEarthquake->shakemap_image)) {
            Storage::disk('public')->delete($localEarthquake->shakemap_image);
        }

        $localEarthquake->delete();

        AuditLog::log('HAPUS_GEMPA_LOKAL', 'GEMPA', $desc);

        return redirect()->back()->with('success', 'Data gempabumi lokal berhasil dihapus.');
    }
}

