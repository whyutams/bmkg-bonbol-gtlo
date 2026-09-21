<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\HthData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HthController extends Controller
{
    public function index(Request $request): Response
    {
        $dasarian = $request->input('dasarian', 'II');
        $month = $request->input('month', 'September');
        $year = (int) $request->input('year', 2026);

        $hthList = HthData::with('user')
            ->where('dasarian', $dasarian)
            ->where('month', $month)
            ->where('year', $year)
            ->orderBy('region_name')
            ->orderBy('days_without_rain', 'desc')
            ->get();

        return Inertia::render('Admin/Hth/Index', [
            'hthList' => $hthList,
            'filters' => [
                'dasarian' => $dasarian,
                'month' => $month,
                'year' => $year,
            ],
        ]);
    }

    public function update(Request $request, HthData $hth): RedirectResponse
    {
        $validated = $request->validate([
            'days_without_rain' => 'required|integer|min:0|max:365',
        ]);

        $cat = HthData::determineCategory($validated['days_without_rain']);

        $hth->update([
            'days_without_rain' => $validated['days_without_rain'],
            'risk_category' => $cat['category'],
            'status_label' => $cat['label'],
            'updated_by' => auth()->id(),
        ]);

        AuditLog::log(
            'UPDATE_HTH',
            'IKLIM_HTH',
            "Memperbarui data HTH {$hth->district_name} ({$hth->region_name}) menjadi {$validated['days_without_rain']} hari ({$cat['category']})."
        );

        return redirect()->back()->with('success', "Data HTH {$hth->district_name} berhasil diperbarui.");
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'region_name' => 'required|string|max:100',
            'district_name' => 'required|string|max:100',
            'days_without_rain' => 'required|integer|min:0|max:365',
            'dasarian' => 'required|in:I,II,III',
            'month' => 'required|string|max:20',
            'year' => 'required|integer|min:2020|max:2030',
        ]);

        $cat = HthData::determineCategory($validated['days_without_rain']);

        HthData::updateOrCreate(
            [
                'region_name' => $validated['region_name'],
                'district_name' => $validated['district_name'],
                'dasarian' => $validated['dasarian'],
                'month' => $validated['month'],
                'year' => $validated['year'],
            ],
            [
                'days_without_rain' => $validated['days_without_rain'],
                'risk_category' => $cat['category'],
                'status_label' => $cat['label'],
                'observation_date' => date('Y-m-d'),
                'updated_by' => auth()->id(),
            ]
        );

        AuditLog::log(
            'INPUT_HTH',
            'IKLIM_HTH',
            "Menambah/memperbarui data HTH {$validated['district_name']} dasarian {$validated['dasarian']} {$validated['month']} {$validated['year']}."
        );

        return redirect()->back()->with('success', 'Data HTH berhasil disimpan.');
    }
}
