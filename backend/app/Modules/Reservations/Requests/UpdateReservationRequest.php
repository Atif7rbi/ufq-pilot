<?php

declare(strict_types=1);

namespace App\Modules\Reservations\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateReservationRequest extends FormRequest
{
    public function authorize(): bool { return $this->user() !== null; }

    public function rules(): array
    {
        return [
            'expires_at' => ['sometimes', 'date', 'after:now'],
            'notes' => ['sometimes', 'nullable', 'string'],
            'unit_id' => ['prohibited'],
            'customer_id' => ['prohibited'],
            'tenant_id' => ['prohibited'],
            'reserved_at' => ['prohibited'],
            'status' => ['prohibited'],
        ];
    }
}
