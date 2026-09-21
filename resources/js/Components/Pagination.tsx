import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
    from?: number;
    to?: number;
    total?: number;
    className?: string;
}

export default function Pagination({ links, from, to, total, className = '' }: PaginationProps) {
    if (!links || links.length <= 1) return null;

    const cleanLabel = (label: string) => {
        const lower = (label || '').toLowerCase();
        if (lower.includes('prev') || lower.includes('laquo') || lower.includes('sebelum')) return 'Sebelumnya';
        if (lower.includes('next') || lower.includes('raquo') || lower.includes('berikut')) return 'Berikutnya';
        return label;
    };

    return (
        <div className={`p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${className}`}>
            <div className="text-slate-500">
                {total !== undefined && from !== undefined && to !== undefined ? (
                    <span>
                        Menampilkan <strong className="font-semibold text-slate-700">{from}</strong> - <strong className="font-semibold text-slate-700">{to}</strong> dari <strong className="font-semibold text-slate-700">{total}</strong> data
                    </span>
                ) : (
                    <span>Navigasi Halaman</span>
                )}
            </div>

            <nav className="flex items-center gap-1">
                {links.map((link, index) => {
                    const lower = (link.label || '').toLowerCase();
                    const isPrev = lower.includes('prev') || lower.includes('laquo') || lower.includes('sebelum');
                    const isNext = lower.includes('next') || lower.includes('raquo') || lower.includes('berikut');
                    const label = cleanLabel(link.label);

                    if (!link.url) {
                        return (
                            <span
                                key={index}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-300 select-none cursor-not-allowed text-xs flex items-center gap-1"
                            >
                                {isPrev && <ChevronLeft className="w-3.5 h-3.5" />}
                                <span>{label}</span>
                                {isNext && <ChevronRight className="w-3.5 h-3.5" />}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            preserveScroll
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1 ${
                                link.active
                                    ? 'bg-bmkg-primary border-bmkg-primary text-white shadow-xs'
                                    : 'border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                        >
                            {isPrev && <ChevronLeft className="w-3.5 h-3.5" />}
                            <span>{label}</span>
                            {isNext && <ChevronRight className="w-3.5 h-3.5" />}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
