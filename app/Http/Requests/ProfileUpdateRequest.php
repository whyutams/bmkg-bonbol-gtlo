<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'nip' => ['nullable', 'string', 'max:30'],
            'jabatan' => ['nullable', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:25'],
            'gender' => ['nullable', 'in:pria,wanita'],
            'avatar' => ['nullable', 'string', 'max:255'],
            'avatar_file' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:4096'],
        ];
    }
}
