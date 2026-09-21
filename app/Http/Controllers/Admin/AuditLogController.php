<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(): Response
    {
        $logs = AuditLog::latest()->paginate(25);

        return Inertia::render('Admin/AuditLogs/Index', [
            'logs' => $logs,
        ]);
    }
}
