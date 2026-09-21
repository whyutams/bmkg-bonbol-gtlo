import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
                mono: ['IBM Plex Mono', 'Menlo', 'monospace'],
            },
            colors: {
                bmkg: {
                    navy: '#0f172a',
                    dark: '#0f172a',
                    primary: '#003580',
                    secondary: '#1a5fb4',
                    accent: '#2e86de',
                    light: '#e8f1fb',
                    surface: '#f4f7fb',
                    card: '#ffffff',
                    border: '#d0dce8',
                    text: '#1a2b4a',
                    muted: '#4a5e7a',
                },
                warning: {
                    normal: '#16a34a',
                    waspada: '#f59e0b',
                    siaga: '#ea580c',
                    awas: '#dc2626',
                },
            },
        },
    },

    plugins: [forms],
};
