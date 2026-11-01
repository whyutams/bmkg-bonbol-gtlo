export function formatWaktuIndo(dateStr?: string | null, includeTime: boolean = true): string {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;

        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'Asia/Makassar',
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

/**
 * Mendapatkan string tanggal dan jam saat ini dalam format YYYY-MM-DDTHH:mm untuk input datetime-local (WITA).
 */
export function getWitaDateTimeLocal(date: Date = new Date()): string {
    const d = (date instanceof Date && !isNaN(date.getTime())) ? date : new Date();
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Makassar',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        hourCycle: 'h23'
    }).formatToParts(d);
    const get = (type: string) => parts.find(p => p.type === type)?.value || '00';
    return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

/**
 * Mendapatkan string tanggal saat ini dalam format YYYY-MM-DD untuk input date (WITA).
 */
export function getWitaDateOnly(date: Date = new Date()): string {
    const d = (date instanceof Date && !isNaN(date.getTime())) ? date : new Date();
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Makassar',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(d);
    const get = (type: string) => parts.find(p => p.type === type)?.value || '00';
    return `${get('year')}-${get('month')}-${get('day')}`;
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

/**
 * Mengonversi waktu gempa dari format BMKG (WIB / DateTime UTC) ke Waktu Indonesia Tengah (WITA).
 */
export function convertWibToWita(
    jamStr?: string | null,
    dateTimeStr?: string | null,
    tanggalStr?: string | null
): { jam: string; tanggal: string } {
    if (dateTimeStr) {
        try {
            const date = new Date(dateTimeStr);
            if (!isNaN(date.getTime())) {
                const jamWita = new Intl.DateTimeFormat('id-ID', {
                    timeZone: 'Asia/Makassar',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }).format(date) + ' WITA';

                const tglWita = new Intl.DateTimeFormat('id-ID', {
                    timeZone: 'Asia/Makassar',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }).format(date);

                return { jam: jamWita, tanggal: tglWita };
            }
        } catch {
            // fallback ke penyesuaian string
        }
    }

    if (!jamStr) {
        return { jam: '- WITA', tanggal: tanggalStr || '-' };
    }

    // Jika string mengandung jam, menit, dan opsional detik
    const match = jamStr.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (match) {
        let hour = parseInt(match[1], 10) + 1; // Konversi WIB (UTC+7) ke WITA (UTC+8) -> +1 jam
        const minute = match[2];
        const second = match[3] || '00';
        if (hour >= 24) {
            hour = hour % 24;
        }
        const hourStr = hour.toString().padStart(2, '0');
        return {
            jam: `${hourStr}:${minute}:${second} WITA`,
            tanggal: tanggalStr || '-'
        };
    }

    return {
        jam: jamStr.replace(/WIB/gi, 'WITA'),
        tanggal: tanggalStr || '-'
    };
}
