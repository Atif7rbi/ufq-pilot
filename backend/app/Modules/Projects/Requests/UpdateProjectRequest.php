<?php

namespace App\Modules\Projects\Requests;

use App\Modules\Projects\Enums\ProjectStatus;
use App\Modules\Projects\Enums\ProjectType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],
            'description' => [
                'nullable',
                'string',
            ],
            'project_type' => [
                'sometimes',
                Rule::enum(ProjectType::class),
            ],
            'status' => [
                'sometimes',
                Rule::enum(ProjectStatus::class),
            ],
            'country_code' => [
                'sometimes',
                'string',
                'size:2',
                'regex:/^[A-Za-z]{2}$/',
            ],
            'city' => [
                'sometimes',
                'required',
                'string',
                'max:120',
            ],
            'district' => [
                'nullable',
                'string',
                'max:120',
            ],
            'address_line' => [
                'nullable',
                'string',
                'max:500',
            ],
            'currency' => [
                'sometimes',
                'string',
                'size:3',
                'regex:/^[A-Za-z]{3}$/',
            ],
            'estimated_budget' => [
                'nullable',
                'numeric',
                'min:0',
            ],
            'planned_start_date' => [
                'nullable',
                'date',
            ],
            'planned_end_date' => [
                'nullable',
                'date',
                'after_or_equal:planned_start_date',
            ],
            'actual_start_date' => [
                'nullable',
                'date',
            ],
            'actual_end_date' => [
                'nullable',
                'date',
                'after_or_equal:actual_start_date',
            ],
            'project_manager_id' => [
                'nullable',
                'integer',
                Rule::exists('users', 'id'),
            ],
            'external_reference' => [
                'nullable',
                'string',
                'max:255',
            ],
            'legacy_reference' => [
                'nullable',
                'string',
                'max:255',
            ],
        ];
    }
}
