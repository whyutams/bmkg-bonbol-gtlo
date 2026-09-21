<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\PosHujan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PosHujanController extends Controller
{
    public function index(): Response
    {
        $stations = PosHujan::with('creator')->orderBy('name')->paginate(15);

        return Inertia::render('Admin/PosHujan/Index', [
            'stations' => $stations,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'code' => 'required|string|max:50|unique:pos_hujan,code',
            'district' => 'required|string|max:100',
            'type' => 'required|in:OBS,HELLMAN,AWS,ARG',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'elevation' => 'required|integer',
            'status' => 'required|in:aktif,kalibrasi,rusak',
            'address' => 'nullable|string',
            'pic_name' => 'nullable|string|max:100',
            'pic_phone' => 'nullable|string|max:30',
        ]);

        $validated['created_by'] = auth()->id();
        $pos = PosHujan::create($validated);

        AuditLog::log(
            'TAMBAH_POS_HUJAN',
            'GIS_POS_HUJAN',
            "Menambahkan titik pos pengamatan hujan baru: {$pos->name} ({$pos->code}) di Kec. {$pos->district}."
        );

        return redirect()->back()->with('success', "Titik pos hujan {$pos->name} berhasil ditambahkan.");
    }

    public function update(Request $request, PosHujan $posHujan): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'district' => 'required|string|max:100',
            'type' => 'required|in:OBS,HELLMAN,AWS,ARG',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'elevation' => 'required|integer',
            'status' => 'required|in:aktif,kalibrasi,rusak',
            'address' => 'nullable|string',
            'pic_name' => 'nullable|string|max:100',
            'pic_phone' => 'nullable|string|max:30',
        ]);

        $posHujan->update($validated);

        AuditLog::log(
            'UPDATE_POS_HUJAN',
            'GIS_POS_HUJAN',
            "Memperbarui status/data pos hujan: {$posHujan->name} ({$posHujan->code}) status: {$posHujan->status}."
        );

        return redirect()->back()->with('success', "Data pos hujan {$posHujan->name} berhasil diperbarui.");
    }

    public function destroy(PosHujan $posHujan): RedirectResponse
    {
        $name = $posHujan->name;
        $posHujan->delete();

        AuditLog::log(
            'HAPUS_POS_HUJAN',
            'GIS_POS_HUJAN',
            "Menghapus pos hujan: {$name}."
        );

        return redirect()->back()->with('success', "Pos hujan {$name} berhasil dihapus.");
    }
}
