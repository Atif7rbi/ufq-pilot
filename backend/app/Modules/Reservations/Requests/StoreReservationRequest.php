<?php

declare(strict_types=1);

namespace App\Modules\Reservations\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool { return $this->user() !== null; }

    public function rules(): array
    {
        return [
            'unit_id' => ['required', 'ulid', 'exists:units,id'],
            'customer_id' => ['required', 'ulid', 'exists:customers,id'],
            'expires_at' => ['sometimes', 'date', 'after:now'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
