<?php

declare(strict_types=1);

namespace App\Modules\Customers\Requests;

use App\Modules\Customers\Enums\CustomerCategory;
use App\Modules\Customers\Enums\CustomerStatus;
use App\Modules\Customers\Enums\CustomerType;
use App\Modules\Shared\Services\ResolveActiveMembership;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(
        ResolveActiveMembership $resolveActiveMembership,
    ): array {
        $membership = $resolveActiveMembership->handle(
            $this->user()
        );

        $tenantId = $membership->tenant_id;

        return [
            'type' => [
                'required',
                Rule::enum(CustomerType::class),
            ],

            'category' => [
                'required',
                Rule::enum(CustomerCategory::class),
            ],

            'status' => [
                'sometimes',
                Rule::in(CustomerStatus::editableValues()),
            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'phone' => [
                'required',
                'string',
                'max:30',
                Rule::unique('customers', 'phone')
                    ->where(
                        fn ($query) => $query->where(
                            'tenant_id',
                            $tenantId
                        )
                    ),
            ],

            'email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'national_id' => [
                'nullable',
                'string',
                'max:50',
                Rule::prohibitedIf(
                    fn (): bool => $this->input('type')
                        === CustomerType::Company->value
                ),
                Rule::unique('customers', 'national_id')
                    ->where(
                        fn ($query) => $query->where(
                            'tenant_id',
                            $tenantId
                        )
                    ),
            ],

            'commercial_registration_number' => [
                'nullable',
                'string',
                'max:50',
                Rule::prohibitedIf(
                    fn (): bool => $this->input('type')
                        === CustomerType::Individual->value
                ),
                Rule::unique(
                    'customers',
                    'commercial_registration_number'
                )->where(
                    fn ($query) => $query->where(
                        'tenant_id',
                        $tenantId
                    )
                ),
            ],

            'city' => [
                'nullable',
                'string',
                'max:120',
            ],

            'address' => [
                'nullable',
                'string',
                'max:500',
            ],

            'notes' => [
                'nullable',
                'string',
            ],
        ];
    }
}
