<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::orderBy('role')->orderBy('name')->paginate(10);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'role' => 'required|in:superadmin,admin,staf',
            'nip' => 'nullable|string|max:30',
            'jabatan' => 'nullable|string|max:100',
            'gender' => 'required|in:pria,wanita,laki-laki,perempuan',
            'avatar' => 'nullable|string|max:100',
            'avatar_file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'phone' => 'nullable|string|max:20',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $avatar = $validated['avatar'] ?? null;
        if ($request->hasFile('avatar_file')) {
            $path = $request->file('avatar_file')->store('avatars', 'public');
            $avatar = $path;
        } elseif (!$avatar) {
            $avatar = in_array($validated['gender'], ['wanita', 'perempuan']) ? 'avatar_wanita_1.svg' : 'avatar_pria_1.svg';
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'nip' => $validated['nip'],
            'jabatan' => $validated['jabatan'],
            'gender' => in_array($validated['gender'], ['wanita', 'perempuan']) ? 'wanita' : 'pria',
            'avatar' => $avatar,
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'is_active' => true,
        ]);

        AuditLog::log(
            'TAMBAH_PEGAWAI',
            'USER_MANAGEMENT',
            "Menambahkan akun pegawai baru: {$user->name} ({$user->email}) dengan peran " . strtoupper($user->role)
        );

        return redirect()->back()->with('success', "Akun pegawai {$user->name} berhasil didaftarkan.");
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak dapat memodifikasi akun Anda sendiri melalui modul ini.');
        }

        $validated = $request->validate([
            'role' => 'required|in:superadmin,admin,staf',
        ]);

        $oldRole = $user->role;
        $user->update([
            'role' => $validated['role'],
        ]);

        AuditLog::log(
            'UPDATE_ROLE_PEGAWAI',
            'USER_MANAGEMENT',
            "Mengubah peran akun pegawai {$user->name} ({$user->email}) dari " . strtoupper($oldRole) . " menjadi " . strtoupper($validated['role'])
        );

        return redirect()->back()->with('success', "Peran akun pegawai {$user->name} berhasil diperbarui.");
    }

    public function toggleStatus(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak dapat mengubah status akun Anda sendiri.');
        }

        $user->update([
            'is_active' => !$user->is_active,
        ]);

        AuditLog::log(
            'TOGGLE_STATUS_PEGAWAI',
            'USER_MANAGEMENT',
            "Mengubah status akun pegawai: {$user->name} ({$user->email}) menjadi " . ($user->is_active ? 'Aktif' : 'Nonaktif')
        );

        return redirect()->back()->with('success', "Status akun pegawai {$user->name} berhasil diperbarui.");
    }

    public function destroy(User $user): RedirectResponse
    {
        if (!auth()->user()->isSuperAdmin()) {
            abort(403, 'Hanya Superadmin yang memiliki izin menghapus akun pegawai.');
        }

        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $userName = $user->name;
        $userEmail = $user->email;
        $user->delete();

        AuditLog::log(
            'HAPUS_PEGAWAI',
            'USER_MANAGEMENT',
            "Superadmin menghapus akun pegawai: {$userName} ({$userEmail})."
        );

        return redirect()->back()->with('success', "Akun pegawai {$userName} berhasil dihapus permanen dari sistem.");
    }
}
