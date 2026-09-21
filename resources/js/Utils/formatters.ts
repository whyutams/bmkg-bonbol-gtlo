export function formatWaktuIndo(dateStr?: string | null, includeTime: boolean = true): string {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;

        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        };

        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
            options.hour12 = false;
        }

        const formatted = new Intl.DateTimeFormat('id-ID', options).format(d);
        return includeTime ? `${formatted} WITA` : formatted;
    } catch {
        return dateStr;
    }
}

export function formatTanggalIndo(dateStr?: string | null): string {
    return formatWaktuIndo(dateStr, false);
}

export function formatRupiah(val?: number | string | null): string {
    if (val === null || val === undefined) return 'Rp 0';
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
}
