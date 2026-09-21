<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Bulletin;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BulletinController extends Controller
{
    public function index(): Response
    {
        $bulletins = Bulletin::with('user')->latest('published_date')->paginate(10);

        return Inertia::render('Admin/Bulletins/Index', [
            'bulletins' => $bulletins,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'edition' => 'required|string|max:100',
            'category' => 'required|in:buletin,peta,laporan',
            'published_date' => 'required|date',
            'summary' => 'nullable|string',
            'file_pdf' => 'nullable|file|mimes:pdf|max:4096',
            'file_size' => 'nullable|string|max:50',
            'file_type' => 'nullable|string|max:20',
            'download_url' => 'nullable|string',
        ]);

        $downloadUrl = $validated['download_url'] ?? '#';
        $fileSize = $validated['file_size'] ?? '2.8 MB';
        $fileType = 'PDF';

        if ($request->hasFile('file_pdf')) {
            $file = $request->file('file_pdf');
            $path = $file->store('bulletins', 'public');
            $downloadUrl = asset('storage/' . $path);
            $bytes = $file->getSize();
            $fileSize = round($bytes / (1024 * 1024), 1) . ' MB';
            $fileType = 'PDF';
        }

        $bulletin = Bulletin::create([
            'title' => $validated['title'],
            'edition' => $validated['edition'],
            'category' => $validated['category'],
            'file_size' => $fileSize,
            'file_type' => $fileType,
            'download_url' => $downloadUrl,
            'published_date' => $validated['published_date'],
            'is_published' => true,
            'summary' => $validated['summary'],
            'uploaded_by' => auth()->id(),
        ]);

        AuditLog::log(
            'UPLOAD_BULETIN',
            'PUBLIKASI_IKLIM',
            "Mengunggah buletin/publikasi iklim baru: {$bulletin->title} ({$bulletin->edition}) oleh " . auth()->user()->name
        );

        return redirect()->back()->with('success', 'Publikasi buletin iklim berhasil diterbitkan.');
    }

    public function destroy(Bulletin $bulletin): RedirectResponse
    {
        $title = $bulletin->title;
        $bulletin->delete();

        AuditLog::log(
            'HAPUS_BULETIN',
            'PUBLIKASI_IKLIM',
            "Menghapus publikasi buletin iklim: {$title} oleh " . auth()->user()->name
        );

        return redirect()->back()->with('success', 'Publikasi berhasil dihapus.');
    }
}
