<?php

declare(strict_types=1);

namespace App\Modules\Customers\Models;

use App\Models\Tenant;
use App\Models\User;
use App\Modules\Customers\Enums\CustomerCategory;
use App\Modules\Customers\Enums\CustomerStatus;
use App\Modules\Customers\Enums\CustomerType;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Customer extends Model
{
    use HasFactory;
    use HasUlids;

    protected $fillable = [
        'tenant_id',
        'type',
        'category',
        'status',
        'name',
        'phone',
        'email',
        'national_id',
        'commercial_registration_number',
        'city',
        'address',
        'notes',
        'created_by',
        'updated_by',
        'archived_by',
        'restored_by',
        'archived_at',
    ];

    protected function casts(): array
    {
        return [
            'type' => CustomerType::class,
            'category' => CustomerCategory::class,
            'status' => CustomerStatus::class,
            'archived_at' => 'datetime',
        ];
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'updated_by'
        );
    }

    public function archiver(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'archived_by'
        );
    }

    public function restorer(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'restored_by'
        );
    }

    public function isIndividual(): bool
    {
        return $this->type === CustomerType::Individual;
    }

    public function isCompany(): bool
    {
        return $this->type === CustomerType::Company;
    }

    public function isArchived(): bool
    {
        return $this->status === CustomerStatus::Archived;
    }
}
