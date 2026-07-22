<?php

declare(strict_types=1);

namespace App\Modules\Reservations\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

/** @mixin \App\Modules\Reservations\Models\Reservation */
final class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $modelExpiresAt = $this->expires_at?->toISOString();
        $responseExpiresAt = $modelExpiresAt;

        Log::debug('Reservation resource expiry serialization', [
            'reservation_id' => $this->id,
            'model_expires_at' => $modelExpiresAt,
            'response_expires_at' => $responseExpiresAt,
        ]);

        return [
            'id' => $this->id,
            'tenant_id' => $this->tenant_id,
            'unit_id' => $this->unit_id,
            'customer_id' => $this->customer_id,
            'status' => $this->status->value,
            'reserved_at' => $this->reserved_at?->toISOString(),
            'expires_at' => $responseExpiresAt,
            'notes' => $this->notes,
            'cancellation_reason' => $this->cancellation_reason,
            'cancelled_at' => $this->cancelled_at?->toISOString(),
            'cancelled_by' => $this->cancelled_by,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'unit' => $this->whenLoaded('unit'),
            'customer' => $this->whenLoaded('customer'),
        ];
    }
}
