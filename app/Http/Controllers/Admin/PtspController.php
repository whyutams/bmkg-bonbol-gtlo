<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\PtspTicket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PtspController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->input('status', 'all');
        $query = PtspTicket::with('user')->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $tickets = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Ptsp/Index', [
            'tickets' => $tickets,
            'currentFilter' => $status,
        ]);
    }

    public function updateStatus(Request $request, PtspTicket $ticket): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:menunggu,diproses,selesai,ditolak',
            'admin_notes' => 'nullable|string',
            'tariff_amount' => 'nullable|numeric|min:0',
        ]);

        $ticket->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'] ?? $ticket->admin_notes,
            'tariff_amount' => $validated['tariff_amount'] ?? $ticket->tariff_amount,
            'processed_by' => auth()->id(),
        ]);

        AuditLog::log(
            'UPDATE_TIKET_PTSP',
            'LAYANAN_PTSP',
            "Memperbarui status tiket {$ticket->ticket_number} ({$ticket->applicant_name}) menjadi: " . strtoupper($validated['status'])
        );

        return redirect()->back()->with('success', "Status tiket {$ticket->ticket_number} berhasil diperbarui.");
    }
}
