import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShieldCheck, Clock, User, Globe, Activity, Lock } from 'lucide-react';
import Pagination, { PaginationLink } from '@/Components/Pagination';
import { formatWaktuIndo } from '@/Utils/formatters';

interface LogItem {
    id: number;
    user_name: string;
    user_role: string;
    action: string;
    module: string;
    description: string;
    ip_address: string;
    user_agent?: string;
    created_at: string;
}

interface AuditLogProps {
    logs: {
        data: LogItem[];
        links: PaginationLink[];
        from?: number;
        to?: number;
        total?: number;
    };
}

export default function AuditLogIndex({ logs }: AuditLogProps) {
    return (
        <AuthenticatedLayout title="Log Aktivitas & Audit Trail Keamanan">
            <Head title="Audit Log Keamanan - Super Admin BMKG" />

            <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">Jejak Audit Aktivitas Pegawai (Audit Trail)</h2>
                        <p className="text-xs text-slate-500">Mencatat seluruh aksi penambahan, perubahan status, dan penghapusan data secara transparan.</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Log Immutable (Anti-Tamper)</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Waktu & Tanggal</th>
                                    <th className="py-3 px-4">Nama Pegawai & Peran</th>
                                    <th className="py-3 px-4">Aksi / Event</th>
                                    <th className="py-3 px-4">Modul</th>
                                    <th className="py-3 px-4">Deskripsi Aktivitas</th>
                                    <th className="py-3 px-4 font-mono">Alamat IP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {logs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                                            {formatWaktuIndo(log.created_at, true)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="font-bold text-slate-800">{log.user_name || 'Sistem'}</p>
                                            <span className="text-[10px] text-slate-400 font-mono uppercase">{log.user_role}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="bg-slate-100 text-slate-800 font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-slate-200">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-slate-700">{log.module}</td>
                                        <td className="py-3 px-4 text-slate-600">{log.description}</td>
                                        <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{log.ip_address || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={logs.links}
                        from={logs.from}
                        to={logs.to}
                        total={logs.total}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
