import React, { PropsWithChildren } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Navbar from '@/Components/BMKG/Navbar';
import Footer from '@/Components/BMKG/Footer';
import WeatherTicker from '@/Components/BMKG/WeatherTicker';

interface MainLayoutProps {
    title?: string;
}

export default function MainLayout({ title, children }: PropsWithChildren<MainLayoutProps>) {
    const { url } = usePage();

    return (
        <div className="min-h-screen flex flex-col bg-bmkg-surface text-bmkg-text font-sans antialiased selection:bg-bmkg-accent selection:text-white">
            <Head>
                <title>{title ? `${title} - Stasiun Klimatologi BMKG Bone Bolango` : 'Stasiun Klimatologi BMKG Bone Bolango'}</title>
                <meta name="description" content="Portal Resmi Stasiun Klimatologi BMKG Bone Bolango Gorontalo. Informasi cuaca, iklim, gempabumi, HTH, dan pelayanan data BMKG." />
                <meta name="keywords" content="BMKG, Stasiun Klimatologi, Bone Bolango, Gorontalo, Cuaca, Iklim, HTH, Gempa Bumi, PNBP" />
                <link rel="icon" type="image/png" href="https://upload.wikimedia.org/wikipedia/commons/e/e3/BMG_2003.png" />
            </Head>

            
            <Navbar currentRoute={url} />

            
            <WeatherTicker />

            
            <main className="flex-1 w-full pb-16">
                {children}
            </main>

            
            <Footer />
        </div>
    );
}
