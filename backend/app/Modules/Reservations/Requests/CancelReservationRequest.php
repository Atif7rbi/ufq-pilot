<?php

declare(strict_types=1);

namespace App\Modules\Reservations\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class CancelReservationRequest extends FormRequest
{
    public function authorize(): bool { return $this->user() !== null; }

    public function rules(): array
    {
        return ['cancellation_reason' => ['nullable', 'string']];
    }
}
