<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class JobPostingRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'required_skills' => ['required', 'array', 'min:1'],
            'required_skills.*' => ['string', 'max:50'],
            'salary_min' => ['nullable', 'integer', 'min:0'],
            'salary_max' => ['nullable', 'integer', 'min:0'],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['in:open,closed'],
        ];
    }


    public function messages(): array
    // messages() = バリデーションエラーメッセージを日本語にする
    {
        return [
            'title.required' => '求人タイトルは必須です',
            'description.required' => '求人詳細は必須です',
            'required_skills.array' => 'スキルは配列形式で送ってください',
            'required_skills.*.string' => 'スキルは文字列で入力してください',
            'required_skills.*.max' => 'スキルは50文字以内で入力してください',
            'required_skills.required' => 'スキルを1つ以上入力してください',
            'required_skills.min' => 'スキルを1つ以上入力してください',
            'salary_min.integer' => '最低年収は整数で入力してください',
            'salary_max.integer' => '最高年収は整数で入力してください',
            'status.in' => 'ステータスはopenまたはclosedを指定してください',
        ];
    }
}
