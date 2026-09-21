<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\EarlyWarning;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WarningController extends Controller
{
    public function index(): Response
    {
        $currentWarning = EarlyWarning::where('is_active', true)->latest()->first();
        $history = EarlyWarning::with('user')->latest()->paginate(10);

        return Inertia::render('Admin/Warnings/Index', [
            'currentWarning' => $currentWarning,
            'history' => $history,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'level' => 'required|in:normal,waspada,siaga,awas',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'affected_areas' => 'nullable|array',
            'valid_until' => 'required|string|max:100',
        ]);

        EarlyWarning::where('is_active', true)->update(['is_active' => false]);

        $warning = EarlyWarning::create([
            'level' => $validated['level'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'affected_areas' => $validated['affected_areas'] ?? ['Kabupaten Bone Bolango'],
            'issued_at' => date('d F Y') . ' ' . date('H:i') . ' WITA',
            'valid_until' => $validated['valid_until'],
            'is_active' => true,
            'updated_by' => auth()->id(),
        ]);

        AuditLog::log(
            'UPDATE_PERINGATAN_DINI',
            'PERINGATAN_DINI',
            'Memperbarui status peringatan dini menjadi: ' . strtoupper($warning->level) . ' - ' . $warning->title
        );

        return redirect()->back()->with('success', 'Status peringatan dini cuaca berhasil diperbarui.');
    }
}
