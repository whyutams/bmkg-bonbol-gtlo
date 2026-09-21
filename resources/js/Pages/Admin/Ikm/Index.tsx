import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Smile, Star, MessageSquare, TrendingUp, CheckCircle2, User, Building2, Award, Users } from 'lucide-react';
import Pagination, { PaginationLink } from '@/Components/Pagination';
import { formatWaktuIndo } from '@/Utils/formatters';

interface SurveyItem {
    id: number;
    respondent_name: string;
    agency?: string;
    service_type?: string;
    score_total: number;
    feedback?: string;
    created_at: string;
}

interface IkmProps {
    surveys: {
        data: SurveyItem[];
        links: PaginationLink[];
        from?: number;
        to?: number;
        total?: number;
    };
    summary: {
        totalRespondents: number;
        averageScore: number;
        averages: Record<string, number>;
    };
}

export default function IkmIndex({ surveys, summary }: IkmProps) {
    const questions = [
        { key: 'q1', label: '1. Kesesuaian Persyaratan Pelayanan', val: summary.averages.q1 },
        { key: 'q2', label: '2. Kemudahan Prosedur Pelayanan', val: summary.averages.q2 },
        { key: 'q3', label: '3. Kecepatan Waktu Pelayanan', val: summary.averages.q3 },
        { key: 'q4', label: '4. Kesesuaian Tarif / Biaya PNBP', val: summary.averages.q4 },
        { key: 'q5', label: '5. Kesesuaian Produk Pelayanan Data', val: summary.averages.q5 },
        { key: 'q6', label: '6. Kompetensi / Keahlian Petugas', val: summary.averages.q6 },
        { key: 'q7', label: '7. Perilaku / Keramahan Petugas', val: summary.averages.q7 },
        { key: 'q8', label: '8. Kualitas Sarana & Prasarana', val: summary.averages.q8 },
        { key: 'q9', label: '9. Penanganan Pengaduan & Masukan', val: summary.averages.q9 },
    ];

    return (
        <AuthenticatedLayout title="Hasil Kuesioner Indeks Kepuasan Masyarakat (IKM)">
            <Head title="Analitik IKM - Admin BMKG" />

            <div className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nilai Rata-rata IKM</span>
                            <div className="text-2xl font-black text-purple-700 font-mono mt-0.5">
                                {summary.averageScore} <span className="text-xs font-semibold text-slate-400">/ 100</span>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-600">Mutu Pelayanan: SANGAT BAIK (A)</span>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Responden</span>
                            <div className="text-2xl font-black text-slate-800 font-mono mt-0.5">
                                {summary.totalRespondents}
                            </div>
                            <span className="text-[11px] text-slate-500">Masyarakat & Pemohon Data</span>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                            <Star className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Standar Kemenpan RB</span>
                            <div className="text-sm font-bold text-slate-800 mt-1">
                                Permenpan RB No. 14 / 2017
                            </div>
                            <span className="text-[11px] text-slate-500">Kepatuhan Pelayanan Publik</span>
                        </div>
                    </div>
                </div>

                
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Rincian Skor Per Unsur Pelayanan (Skala 1.00 s.d. 4.00)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {questions.map((q) => (
                            <div key={q.key} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                                <span className="text-xs text-slate-700 font-medium">{q.label}</span>
                                <div className="mt-2 flex items-center justify-between">
                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mr-3">
                                        <div 
                                            className="bg-purple-600 h-full rounded-full"
                                            style={{ width: `${(q.val / 4.0) * 100}%` }}
                                        />
                                    </div>
                                    <span className="font-mono font-bold text-xs text-purple-800">{q.val.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-slate-600" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                Respon & Kritik / Saran Responden
                            </h3>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {surveys.data.map((s) => (
                            <div key={s.id} className="p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-xs text-slate-800">{s.respondent_name || 'Masyarakat (Anonim)'}</span>
                                        {s.service_type && (
                                            <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded border border-slate-200">
                                                {s.service_type}
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                                        Skor: {s.score_total}
                                    </span>
                                </div>
                                {s.feedback && (
                                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 italic">
                                        "{s.feedback}"
                                    </p>
                                )}
                                <span className="text-[10px] text-slate-400 mt-1.5 block">
                                    {formatWaktuIndo(s.created_at, false)}
                                </span>
                            </div>
                        ))}
                        {surveys.data.length === 0 && (
                            <div className="p-8 text-center text-xs text-slate-400">
                                Belum ada data respon kuesioner IKM.
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-slate-100">
                        <Pagination links={surveys.links} from={surveys.from} to={surveys.to} total={surveys.total} />
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
