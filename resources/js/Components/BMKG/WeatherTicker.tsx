import React from 'react';

interface TickerItem {
    name: string;
    temp: number;
    condition: string;
    icon: string;
}

const DEFAULT_TICKER_DATA: TickerItem[] = [
    { name: 'Suwawa (Bone Bolango)', temp: 30, condition: 'Cerah Berawan', icon: '🌤' },
    { name: 'Kabila', temp: 29, condition: 'Berawan', icon: '⛅' },
    { name: 'Tilongkabila', temp: 29, condition: 'Cerah Berawan', icon: '🌤' },
    { name: 'Bonepantai', temp: 31, condition: 'Cerah', icon: '☀️' },
    { name: 'Bulango Ulu', temp: 28, condition: 'Hujan Ringan', icon: '🌧' },
    { name: 'Tapa', temp: 29, condition: 'Berawan', icon: '⛅' },
    { name: 'Pinogu', temp: 26, condition: 'Hujan Ringan', icon: '🌧' },
    { name: 'Kota Gorontalo', temp: 31, condition: 'Cerah Berawan', icon: '🌤' },
    { name: 'Limboto (Kab. Gorontalo)', temp: 30, condition: 'Berawan', icon: '⛅' },
    { name: 'Tilamuta (Boalemo)', temp: 29, condition: 'Hujan Ringan', icon: '🌧' },
    { name: 'Marisa (Pohuwato)', temp: 32, condition: 'Cerah', icon: '☀️' },
    { name: 'Kwandang (Gorontalo Utara)', temp: 30, condition: 'Cerah Berawan', icon: '🌤' },
];

export default function WeatherTicker() {
    const [tickerData, setTickerData] = React.useState<TickerItem[]>(DEFAULT_TICKER_DATA);

    React.useEffect(() => {
        fetch('/api/bmkg/cuaca')
            .then(res => res.json())
            .then(json => {
                if (json?.data?.[0]?.cuaca?.[0]?.length) {
                    const cur = json.data[0].cuaca[0][0];
                    if (cur) {
                        const tempVal = Number(cur.t) || 30;
                        const condDesc = cur.weather_desc || 'Cerah Berawan';

                        setTickerData(prev => prev.map(item => ({
                            ...item,
                            temp: tempVal,
                            condition: condDesc,
                        })));
                    }
                }
            })
            .catch(() => console.log('Weather ticker fallback'));
    }, []);

    return (
        <div className="w-full bg-[#0f172a] text-white border-b border-slate-800 flex items-center overflow-hidden h-9 select-none">
            <div className="flex-shrink-0 bg-slate-900 px-3.5 py-2 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 border-r border-slate-700/60 z-10">
                <span className="text-slate-200">
                    Prakiraan Cuaca
                    <span className="hidden sm:inline"> Bone Bolango & Gorontalo</span>
                </span>
            </div>

            <div className="flex-1 overflow-hidden relative">
                <div className="animate-ticker">
                    {[...tickerData, ...tickerData].map((item, idx) => (
                        <div
                            key={idx}
                            className="inline-flex items-center gap-2 px-4 py-1 text-xs border-r border-slate-800 whitespace-nowrap"
                        >
                            <span className="font-medium text-slate-200">{item.name}</span>
                            <span className="text-sm leading-none">{item.icon}</span>
                            <span className="font-mono font-bold text-white">{item.temp}°C</span>
                            <span className="text-slate-400 text-[11px]">({item.condition})</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
