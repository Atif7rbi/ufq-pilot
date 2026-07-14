<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSystemSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'company_name_ar' => ['sometimes', 'required', 'string', 'max:200'],
            'company_name_en' => ['sometimes', 'nullable', 'string', 'max:200'],
            'short_name_ar' => ['sometimes', 'required', 'string', 'max:100'],
            'short_name_en' => ['sometimes', 'nullable', 'string', 'max:100'],

            'logo_path' => ['sometimes', 'nullable', 'string', 'max:255'],
            'favicon_path' => ['sometimes', 'nullable', 'string', 'max:255'],

            'primary_color' => [
                'sometimes',
                'required',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
            'secondary_color' => [
                'sometimes',
                'required',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],

            'language' => ['sometimes', 'required', 'string', 'max:10'],
            'timezone' => ['sometimes', 'required', 'timezone'],
            'currency' => ['sometimes', 'required', 'string', 'size:3'],
            'date_format' => ['sometimes', 'required', 'string', 'max:30'],

            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'email' => ['sometimes', 'nullable', 'email', 'max:254'],
            'website' => ['sometimes', 'nullable', 'url:http,https', 'max:255'],
            'address' => ['sometimes', 'nullable', 'string', 'max:2000'],

            'commercial_registration' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],
            'vat_number' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'company_name_ar.required' => 'اسم الشركة بالعربية مطلوب.',
            'short_name_ar.required' => 'الاسم المختصر بالعربية مطلوب.',
            'primary_color.regex' => 'اللون الأساسي يجب أن يكون بصيغة Hex صحيحة.',
            'secondary_color.regex' => 'اللون الثانوي يجب أن يكون بصيغة Hex صحيحة.',
            'timezone.timezone' => 'المنطقة الزمنية غير صحيحة.',
            'currency.size' => 'رمز العملة يجب أن يتكون من ثلاثة أحرف.',
            'email.email' => 'البريد الإلكتروني غير صحيح.',
            'website.url' => 'رابط الموقع الإلكتروني غير صحيح.',
        ];
    }
}
