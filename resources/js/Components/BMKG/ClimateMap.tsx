import React, { useState, useEffect } from 'react';
import { RainStation } from '@/types/bmkg';
import { MapPin, Info, Layers, RefreshCw } from 'lucide-react';

const STATIONS: RainStation[] = [
    {
        id: 'staklim_bonbol',
        name: 'Stasiun Klimatologi Bone Bolango',
        lat: 0.5583,
        lng: 123.0551,
        type: 'Kantor Pusat',
        district: 'Tilongkabila',
        regency: 'Bone Bolango',
        elevation: '25 mdpl',
        rainfallToday: 4,
        status: 'Aktif'
    },
    {
        id: 'pos_suwawa',
        name: 'Pos Hujan Suwawa',
        lat: 0.5372,
        lng: 123.1411,
        type: 'Pos Kerjasama',
        district: 'Suwawa',
        regency: 'Bone Bolango',
        elevation: '35 mdpl',
        rainfallToday: 8,
        status: 'Aktif'
    },
    {
        id: 'pos_kabila',
        name: 'Pos Hujan Kabila',
        lat: 0.5489,
        lng: 123.0928,
        type: 'Pos Pengamatan Manual',
        district: 'Kabila',
        regency: 'Bone Bolango',
        elevation: '22 mdpl',
        rainfallToday: 5,
        status: 'Aktif'
    },
    {
        id: 'pos_bonepantai',
        name: 'Pos Hujan Bonepantai',
        lat: 0.4128,
        lng: 123.2514,
        type: 'AWS (Automatic Weather Station)',
        district: 'Bonepantai',
        regency: 'Bone Bolango',
        elevation: '8 mdpl',
        rainfallToday: 0,
        status: 'Aktif'
    },
    {
        id: 'pos_bulango',
        name: 'Pos Hujan Bulango Ulu',
        lat: 0.6514,
        lng: 123.1258,
        type: 'Pos Kerjasama',
        district: 'Bulango Ulu',
        regency: 'Bone Bolango',
        elevation: '68 mdpl',
        rainfallToday: 14,
        status: 'Aktif'
    },
    {
        id: 'pos_pinogu',
        name: 'Pos Hujan Dataran Pinogu',
        lat: 0.4856,
        lng: 123.4125,
        type: 'ARG (Automatic Rain Gauge)',
        district: 'Pinogu',
        regency: 'Bone Bolango',
        elevation: '320 mdpl',
        rainfallToday: 19,
        status: 'Aktif'
    },
    {
        id: 'pos_tapa',
        name: 'Pos Hujan Tapa',
        lat: 0.5789,
        lng: 123.0812,
        type: 'Pos Pengamatan Manual',
        district: 'Tapa',
        regency: 'Bone Bolango',
        elevation: '28 mdpl',
        rainfallToday: 3,
        status: 'Aktif'
    },
    {
        id: 'pos_kota_gorontalo',
        name: 'Pos Hujan Kota Gorontalo',
        lat: 0.5435,
        lng: 123.0568,
        type: 'Pos Pengamatan Manual',
        district: 'Kota Selatan',
        regency: 'Kota Gorontalo',
        elevation: '15 mdpl',
        rainfallToday: 2,
        status: 'Aktif'
    },
    {
        id: 'pos_limboto',
        name: 'Pos Pengamatan Limboto',
        lat: 0.6167,
        lng: 122.9833,
        type: 'Pos Pengamatan Manual',
        district: 'Limboto',
        regency: 'Kab. Gorontalo',
        elevation: '18 mdpl',
        rainfallToday: 6,
        status: 'Aktif'
    }
];

export default function ClimateMap() {
    const [isClient, setIsClient] = useState<boolean>(false);
    const [selectedType, setSelectedType] = useState<string>('all');
    const [activeStation, setActiveStation] = useState<RainStation | null>(null);

    const [MapComponents, setMapComponents] = useState<any>(null);

    useEffect(() => {
        setIsClient(true);

        Promise.all([
            import('react-leaflet'),
            import('leaflet')
        ]).then(([reactLeaflet, L]) => {
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            setMapComponents({
                MapContainer: reactLeaflet.MapContainer,
                TileLayer: reactLeaflet.TileLayer,
                Marker: reactLeaflet.Marker,
                Popup: reactLeaflet.Popup,
                CircleMarker: reactLeaflet.CircleMarker,
                L: L
            });
        }).catch(err => {
            console.error('Failed to load Leaflet:', err);
        });
    }, []);

    const filteredStations = selectedType === 'all' 
        ? STATIONS 
        : STATIONS.filter(s => s.type.toLowerCase().includes(selectedType.toLowerCase()));

    const getStationColor = (type: RainStation['type']) => {
        switch (type) {
            case 'Kantor Pusat': return '#dc2626';
            case 'AWS (Automatic Weather Station)': return '#7c3aed';
            case 'ARG (Automatic Rain Gauge)': return '#2563eb';
            case 'Pos Kerjasama': return '#059669';
            default: return '#d97706';
        }
    };

    if (!isClient || !MapComponents) {
        return (
            <div className="w-full h-[450px] bg-slate-100 rounded-xl border border-bmkg-border flex flex-col items-center justify-center gap-3 text-bmkg-muted">
                <RefreshCw className="w-8 h-8 animate-spin text-bmkg-accent" />
                <span className="text-xs font-semibold">Memuat Peta Jaringan Pos Hujan Bone Bolango...</span>
            </div>
        );
    }

    const { MapContainer, TileLayer, CircleMarker, Popup } = MapComponents;

    return (
        <div className="bg-white rounded-xl border border-bmkg-border shadow-sm overflow-hidden">
            
            <div className="p-3 sm:p-4 border-b border-bmkg-border bg-bmkg-surface flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-bmkg-accent" />
                    <span className="text-xs font-bold uppercase text-bmkg-navy tracking-wider">
                        Filter Tipe Pos Pengamatan:
                    </span>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="text-xs border border-bmkg-border rounded-lg bg-white px-2.5 py-1 text-bmkg-text focus:ring-1 focus:ring-bmkg-accent outline-none"
                    >
                        <option value="all">Semua Pos ({STATIONS.length})</option>
                        <option value="kantor">Kantor Pusat</option>
                        <option value="manual">Pos Manual</option>
                        <option value="kerjasama">Pos Kerjasama</option>
                        <option value="aws">AWS (Otomatis)</option>
                        <option value="arg">ARG (Curah Hujan)</option>
                    </select>
                </div>

                
                <div className="flex items-center gap-3 text-[11px] text-gray-600 flex-wrap">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white shadow-xs" />
                        <span>Kantor UPT</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-600 border border-white shadow-xs" />
                        <span>AWS Otomatis</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-white shadow-xs" />
                        <span>Pos Kerjasama</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-600 border border-white shadow-xs" />
                        <span>Pos Manual</span>
                    </div>
                </div>
            </div>

            
            <div className="w-full h-[450px] relative z-10">
                <MapContainer
                    center={[0.5583, 123.1251]}
                    zoom={10}
                    scrollWheelZoom={false}
                    className="w-full h-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | BMKG'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {filteredStations.map((station: RainStation) => {
                        const color = getStationColor(station.type);

                        return (
                            <CircleMarker
                                key={station.id}
                                center={[station.lat, station.lng]}
                                radius={station.type === 'Kantor Pusat' ? 10 : 7}
                                pathOptions={{
                                    fillColor: color,
                                    fillOpacity: 0.9,
                                    color: '#ffffff',
                                    weight: 2
                                }}
                                eventHandlers={{
                                    click: () => setActiveStation(station)
                                }}
                            >
                                <Popup>
                                    <div className="p-1 min-w-[180px] font-sans text-xs">
                                        <div className="font-bold text-bmkg-primary text-sm mb-1 leading-tight">
                                            {station.name}
                                        </div>
                                        <div className="text-[11px] text-gray-600 mb-1">
                                            Kec. {station.district}, {station.regency}
                                        </div>
                                        <div className="space-y-1 text-[11px] border-t border-gray-100 pt-1.5">
                                            <div><strong>Tipe:</strong> {station.type}</div>
                                            <div><strong>Elevasi:</strong> {station.elevation}</div>
                                            <div><strong>Curah Hujan Hari Ini:</strong> {station.rainfallToday} mm</div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                <span className="text-emerald-700 font-semibold">{station.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        );
                    })}
                </MapContainer>
            </div>

            
            <div className="p-3 bg-bmkg-surface border-t border-bmkg-border text-xs text-gray-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-bmkg-accent flex-shrink-0" />
                    <span>
                        Menampilkan <strong>{filteredStations.length} titik pos pengamatan</strong> di wilayah Kabupaten Bone Bolango & sekitarnya.
                    </span>
                </div>
                <span className="text-[11px] text-gray-500">
                    Sistem Basis Data Pengamatan Klimatologi - BMKG Gorontalo
                </span>
            </div>
        </div>
    );
}
