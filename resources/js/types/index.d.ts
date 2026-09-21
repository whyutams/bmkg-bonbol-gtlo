export interface User {
    id: number;
    name: string;
    email: string;
    role: 'superadmin' | 'admin' | 'staf';
    nip?: string;
    jabatan?: string;
    gender?: 'pria' | 'wanita' | 'laki-laki' | 'perempuan';
    avatar?: string;
    avatar_url?: string;
    phone?: string;
    is_active?: boolean;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
        ticket_number?: string;
    };
};
