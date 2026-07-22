<?php

declare(strict_types=1);

namespace App\Modules\Reservations\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Reservations\Actions\CancelReservationAction;
use App\Modules\Reservations\Actions\CreateReservationAction;
use App\Modules\Reservations\Actions\UpdateReservationAction;
use App\Modules\Reservations\Enums\ReservationStatus;
use App\Modules\Reservations\Exceptions\ReservationNotActiveException;
use App\Modules\Reservations\Exceptions\ReservationUnitUnavailableException;
use App\Modules\Reservations\Models\Reservation;
use App\Modules\Reservations\Requests\CancelReservationRequest;
use App\Modules\Reservations\Requests\StoreReservationRequest;
use App\Modules\Reservations\Requests\UpdateReservationRequest;
use App\Modules\Reservations\Resources\ReservationResource;
use App\Modules\Shared\Services\ResolveActiveMembership;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

final class ReservationController extends Controller
{
    public function __construct(private readonly ResolveActiveMembership $resolveActiveMembership) {}

    public function index(Request $request): JsonResponse
    {
        $membership = $this->resolveActiveMembership->handle($request->user());
        $validated = $request->validate([
            'search' => ['sometimes', 'nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'nullable', Rule::enum(ReservationStatus::class)],
            'unit_id' => ['sometimes', 'nullable', 'ulid'],
            'customer_id' => ['sometimes', 'nullable', 'ulid'],
            'project_id' => ['sometimes', 'nullable', 'ulid'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ]);

        $query = Reservation::query()->with([
            'unit:id,project_id,unit_number,status,archived_at',
            'unit.project:id,project_number,name,status',
            'customer:id,name,status,archived_at',
        ])->where('tenant_id', $membership->tenant_id)->latest();

        if (! empty($validated['search'])) {
            $search = trim($validated['search']);
            $query->where(function ($query) use ($search): void {
                $query->whereHas('unit', fn ($unit) => $unit->where('unit_number', 'ilike', "%{$search}%"))
                    ->orWhereHas('customer', fn ($customer) => $customer->where('name', 'ilike', "%{$search}%"));
            });
        }
        foreach (['status', 'unit_id', 'customer_id'] as $filter) {
            if (! empty($validated[$filter])) { $query->where($filter, $validated[$filter]); }
        }
        if (! empty($validated['project_id'])) {
            $query->whereHas('unit', fn ($unit) => $unit->where('project_id', $validated['project_id']));
        }

        $reservations = $query->paginate((int) ($validated['per_page'] ?? 20));
        $summary = Reservation::query()->where('tenant_id', $membership->tenant_id)
            ->selectRaw('count(*) as total')
            ->selectRaw("count(*) filter (where status = 'active') as active")
            ->selectRaw("count(*) filter (where status = 'cancelled') as cancelled")
            ->selectRaw("count(*) filter (where status = 'expired') as expired")
            ->firstOrFail();

        return response()->json(['data' => [
            'reservations' => ReservationResource::collection($reservations)->response()->getData(true),
            'summary' => [
                'total' => (int) $summary->total,
                'active' => (int) $summary->active,
                'cancelled' => (int) $summary->cancelled,
                'expired' => (int) $summary->expired,
            ],
        ]]);
    }

    public function store(StoreReservationRequest $request, CreateReservationAction $action): JsonResponse
    {
        $membership = $this->resolveActiveMembership->handle($request->user());
        try {
            $reservation = $action->execute((string) $membership->tenant_id, $request->user()->id, $request->validated());
        } catch (ReservationUnitUnavailableException $exception) {
            $this->throwValidationException('unit_id', $exception->getMessage());
        }

        Log::debug('Reservation store model before resource', [
            'reservation_id' => $reservation->id,
            'reserved_at' => $reservation->reserved_at?->toISOString(),
            'expires_at' => $reservation->expires_at?->toISOString(),
            'created_at' => $reservation->created_at?->toISOString(),
            'updated_at' => $reservation->updated_at?->toISOString(),
        ]);

        return response()->json([
            'message' => 'تم إنشاء الحجز بنجاح.',
            'data' => ['reservation' => (new ReservationResource($reservation))->resolve()],
        ], 201);
    }

    public function show(Request $request, string $reservation): JsonResponse
    {
        $membership = $this->resolveActiveMembership->handle($request->user());
        $record = Reservation::query()->with(['unit.project', 'customer'])->where('tenant_id', $membership->tenant_id)->whereKey($reservation)->firstOrFail();
        return response()->json([
            'data' => ['reservation' => (new ReservationResource($record))->resolve()],
        ]);
    }

    public function update(UpdateReservationRequest $request, string $reservation, UpdateReservationAction $action): JsonResponse
    {
        $membership = $this->resolveActiveMembership->handle($request->user());
        try { $record = $action->execute((string) $membership->tenant_id, $reservation, $request->user()->id, $request->validated()); }
        catch (ReservationNotActiveException $exception) { $this->throwValidationException('reservation', $exception->getMessage()); }
        return response()->json([
            'message' => 'تم تحديث الحجز بنجاح.',
            'data' => ['reservation' => (new ReservationResource($record))->resolve()],
        ]);
    }

    public function cancel(CancelReservationRequest $request, string $reservation, CancelReservationAction $action): JsonResponse
    {
        $membership = $this->resolveActiveMembership->handle($request->user());
        try { $record = $action->execute((string) $membership->tenant_id, $reservation, $request->user()->id, $request->validated('cancellation_reason')); }
        catch (ReservationNotActiveException $exception) { $this->throwValidationException('reservation', $exception->getMessage()); }
        return response()->json([
            'message' => 'تم إلغاء الحجز بنجاح.',
            'data' => ['reservation' => (new ReservationResource($record))->resolve()],
        ]);
    }

    private function throwValidationException(string $field, string $message): never
    {
        throw ValidationException::withMessages([$field => [$message]]);
    }
}
