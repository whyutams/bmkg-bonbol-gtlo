import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    AlertTriangle, 
    CloudRain, 
    FileText, 
    MapPin, 
    FileCheck, 
    Smile, 
    Users, 
    ShieldCheck, 
    ArrowRight,
    TrendingUp,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { formatWaktuIndo } from '@/Utils/formatters';

interface DashboardProps {
    stats: {
        warning?: {
            level: string;
            title: string;
            issued_at: string;
            valid_until: string;
        };
        posHujan: {
            total: number;
            active: number;
        };
        bulletins: {
            total: number;
            latest?: {
                title: string;
                edition: string;
                published_date: string;
            };
        };
        tickets: {
            total: number;
            pending: number;
            processing: number;
            completed: number;
        };
        ikm: {
            average: number;
            totalRespondents: number;
        };
        totalUsers: number;
    };
    recentTickets: Array<{
        id: number;
        ticket_number: string;
        applicant_name: string;
        institution: string;
        purpose_category: string;
        status: string;
        created_at: string;
    }>;
    recentHth: Array<{
        id: number;
        district_name: string;
        days_without_rain: number;
        risk_category: string;
        status_label: string;
    }>;
    recentLogs: Array<{
        id: number;
        user_name: string;
        action: string;
        module: string;
        description: string;
        created_at: string;
    }>;
}

export default function Dashboard({ stats, recentTickets, recentHth, recentLogs }: DashboardProps) {
    const warningLevelStyles = {
        normal: { bg: 'bg-emerald-50 border-emerald-200 text-emerald-900', badge: 'bg-emerald-600 text-white' },
        waspada: { bg: 'bg-amber-50 border-amber-300 text-amber-950', badge: 'bg-amber-500 text-white' },
        siaga: { bg: 'bg-orange-50 border-orange-300 text-orange-950', badge: 'bg-orange-600 text-white' },
        awas: { bg: 'bg-red-50 border-red-300 text-red-950', badge: 'bg-red-600 text-white' },
    };

    const currentWarnStyle = warningLevelStyles[stats.warning?.level as keyof typeof warningLevelStyles] || warningLevelStyles.normal;

    return (
        <AuthenticatedLayout title="Dashboard Operasional">
            <Head title="Dashboard Admin BMKG Bone Bolango" />

            <div className="space-y-6">
                
                {stats.warning && (
                    <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${currentWarnStyle.bg} shadow-xs`}>
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-white shadow-2xs mt-0.5">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${currentWarnStyle.badge}`}>
                                        Status {stats.warning.level}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        Masa Berlaku: {stats.warning.valid_until}
                                    </span>
                                </div>
                                <h3 className="text-sm font-bold mt-1 text-slate-900">
                                    {stats.warning.title}
                                </h3>
                            </div>
                        </div>
                        <Link 
                            href="/admin/warnings"
                            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex-shrink-0 flex items-center gap-1.5"
                        >
                            <span>Ubah Status</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                )}

                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tiket Layanan PTSP</span>
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                <FileCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-black text-slate-800 font-mono">
                                {stats.tickets.total}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                                <span className="text-amber-600 font-bold">{stats.tickets.pending} Menunggu</span>
                                <span>•</span>
                                <span className="text-emerald-600 font-bold">{stats.tickets.completed} Selesai</span>
                            </div>
                        </div>
                        <Link href="/admin/ptsp" className="mt-3 pt-2 border-t border-slate-100 text-xs font-semibold text-bmkg-primary flex items-center justify-between">
                            <span>Kelola Tiket</span>
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jaringan Pos Hujan</span>
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                <MapPin className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-black text-slate-800 font-mono">
                                {stats.posHujan.total} <span className="text-xs font-normal text-slate-400">Titik</span>
                            </div>
                            <div className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{stats.posHujan.active} Pos Aktif Beroperasi</span>
                            </div>
                        </div>
                        <Link href="/admin/pos-hujan" className="mt-3 pt-2 border-t border-slate-100 text-xs font-semibold text-bmkg-primary flex items-center justify-between">
                            <span>Inventaris GIS</span>
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Publikasi Buletin</span>
                            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                                <FileText className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-black text-slate-800 font-mono">
                                {stats.bulletins.total} <span className="text-xs font-normal text-slate-400">Dokumen</span>
                            </div>
                            <div className="mt-1 text-[11px] text-slate-500 truncate">
                                Edisi: {stats.bulletins.latest?.edition || 'September 2026'}
                            </div>
                        </div>
                        <Link href="/admin/bulletins" className="mt-3 pt-2 border-t border-slate-100 text-xs font-semibold text-bmkg-primary flex items-center justify-between">
                            <span>Kelola Buletin</span>
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Indeks Kepuasan (IKM)</span>
                            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                                <Smile className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-2xl font-black text-purple-700 font-mono">
                                {stats.ikm.average} <span className="text-xs font-semibold text-slate-500">/ 100</span>
                            </div>
                            <div className="mt-1 text-[11px] text-slate-500">
                                Dari {stats.ikm.totalRespondents} Responden Masyarakat
                            </div>
                        </div>
                        <Link href="/admin/ikm" className="mt-3 pt-2 border-t border-slate-100 text-xs font-semibold text-purple-700 flex items-center justify-between">
                            <span>Lihat Analitik</span>
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>

                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    
                    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileCheck className="w-4 h-4 text-slate-600" />
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                    Permohonan Data PTSP Terbaru
                                </h3>
                            </div>
                            <Link href="/admin/ptsp" className="text-xs font-semibold text-bmkg-primary hover:underline">
                                Semua Tiket →
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {recentTickets.length === 0 ? (
                                <div className="p-6 text-center text-xs text-slate-400">Belum ada tiket masuk</div>
                            ) : (
                                recentTickets.map((t) => (
                                    <div key={t.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-xs text-bmkg-primary">{t.ticket_number}</span>
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                                    t.status === 'menunggu' ? 'bg-amber-100 text-amber-800' :
                                                    t.status === 'diproses' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-emerald-100 text-emerald-800'
                                                }`}>
                                                    {t.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate">{t.applicant_name}</p>
                                            <p className="text-[11px] text-slate-500 truncate">{t.institution}</p>
                                        </div>
                                        <Link 
                                            href="/admin/ptsp"
                                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-bmkg-primary hover:border-bmkg-primary transition-colors flex-shrink-0"
                                        >
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    
                    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CloudRain className="w-4 h-4 text-slate-600" />
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                    Hari Tanpa Hujan (HTH) Bone Bolango
                                </h3>
                            </div>
                            <Link href="/admin/hth" className="text-xs font-semibold text-bmkg-primary hover:underline">
                                Edit HTH →
                            </Link>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-3">
                            {recentHth.map((h) => {
                                const isWarning = h.days_without_rain > 10;
                                return (
                                    <div key={h.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                                        <div className="min-w-0 pr-2">
                                            <p className="text-xs font-semibold text-slate-800 truncate">{h.district_name}</p>
                                            <span className="text-[10px] text-slate-500">{h.risk_category}</span>
                                        </div>
                                        <span className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${
                                            isWarning ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'
                                        }`}>
                                            {h.days_without_rain} <span className="text-[10px] font-normal">Hari</span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-slate-600" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                Log Aktivitas Sistem (Audit Trail)
                            </h3>
                        </div>
                        <Link href="/admin/audit-logs" className="text-xs font-semibold text-bmkg-primary hover:underline">
                            Semua Log →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="py-2.5 px-4">Waktu</th>
                                    <th className="py-2.5 px-4">Pegawai</th>
                                    <th className="py-2.5 px-4">Modul</th>
                                    <th className="py-2.5 px-4">Aktivitas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50">
                                        <td className="py-2.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                                            {formatWaktuIndo(log.created_at)}
                                        </td>
                                        <td className="py-2.5 px-4 font-semibold text-slate-800">{log.user_name}</td>
                                        <td className="py-2.5 px-4">
                                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[10px] border border-slate-200">
                                                {log.module}
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-4 text-slate-600">{log.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
