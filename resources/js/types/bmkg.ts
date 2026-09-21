export interface EarthquakeData {
    Tanggal: string;
    Jam: string;
    DateTime?: string;
    Coordinates: string;
    Lintang: string;
    Bujur: string;
    Magnitude: string;
    Kedalaman: string;
    Wilayah: string;
    Potensi: string;
    Dirasakan: string;
    Shakemap: string;
}

export interface AutogempaResponse {
    Infogempa: {
        gempa: EarthquakeData;
    };
}

export interface GempaTerkiniResponse {
    Infogempa: {
        gempa: EarthquakeData[];
    };
}

export interface WeatherDistrict {
    id: string;
    name: string;
    regency: string;
    temp: number;
    tempMin: number;
    tempMax: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    code: number;
    condition: string;
    rainfall: number;
    time: string;
}

export interface RainStation {
    id: string;
    name: string;
    lat: number;
    lng: number;
    type: 'Kantor Pusat' | 'Pos Pengamatan Manual' | 'AWS (Automatic Weather Station)' | 'ARG (Automatic Rain Gauge)' | 'Pos Kerjasama';
    district: string;
    regency: string;
    elevation: string;
    rainfallToday: number;
    status: 'Aktif' | 'Pemeliharaan';
}

export type WarningLevel = 'normal' | 'waspada' | 'siaga' | 'awas';

export interface EarlyWarning {
    level: WarningLevel;
    title: string;
    description: string;
    issuedAt: string;
    validUntil: string;
    affectedAreas: string[];
}

export interface ClimateHTHItem {
    wilayah: string;
    hari: number;
    kategori: '1-5 hari' | '6-10 hari' | '11-20 hari' | '21-30 hari' | '>30 hari' | 'Ada Hujan';
    keterangan: string;
}

export interface ClimateBulletin {
    id: string;
    title: string;
    edition: string;
    fileSize: string;
    fileType: 'PDF' | 'PNG' | 'XLSX';
    category: 'buletin' | 'peta' | 'laporan';
    downloadUrl: string;
    publishedDate: string;
}

export interface StaffProfile {
    id: string;
    name: string;
    role: string;
    category: 'pimpinan' | 'forecaster' | 'observer' | 'teknisi';
    nip?: string;
    photo?: string;
}
