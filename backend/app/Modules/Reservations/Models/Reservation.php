<?php

declare(strict_types=1);

namespace App\Modules\Reservations\Models;

use App\Models\Tenant;
use App\Models\User;
use App\Modules\Customers\Models\Customer;
use App\Modules\Reservations\Enums\ReservationStatus;
use App\Modules\Units\Models\Unit;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Reservation extends Model
{
    use HasUlids;

    protected $fillable = [
        'tenant_id', 'unit_id', 'customer_id', 'status', 'reserved_at',
        'expires_at', 'notes', 'cancellation_reason', 'cancelled_at',
        'cancelled_by', 'created_by', 'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'status' => ReservationStatus::class,
            'reserved_at' => 'datetime',
            'expires_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function tenant(): BelongsTo { return $this->belongsTo(Tenant::class); }
    public function unit(): BelongsTo { return $this->belongsTo(Unit::class); }
    public function customer(): BelongsTo { return $this->belongsTo(Customer::class); }
    public function canceller(): BelongsTo { return $this->belongsTo(User::class, 'cancelled_by'); }
    public function creator(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function updater(): BelongsTo { return $this->belongsTo(User::class, 'updated_by'); }
}
