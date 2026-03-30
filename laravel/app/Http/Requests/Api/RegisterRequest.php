<?php

namespace App\Http\Requests\Api;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use App\Enums\UserRole;
use Illuminate\Validation\Rules\Password;



class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', 'string', 'in:jobseeker,company,admin'],
        ];
    }

    public function messages():array
    {
        return [
            'name.required'     => '名前は必須です',
            'email.required'    => 'メールアドレスは必須です',
            'email.unique'      => 'このメールアドレスはすでに使われています',
            'password.required' => 'パスワードは必須です',
            'password.confirmed' => 'パスワードが一致しません',
            'role.required'     => '役割は必須です',
            'role.in'           => '役割は求職者・企業・管理者のいずれかを指定してください',
        ];
    }
}
