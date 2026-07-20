<?php

declare(strict_types=1);

namespace App\Modules\Customers\Actions;

use App\Modules\Customers\Enums\CustomerStatus;
use App\Modules\Customers\Exceptions\CustomerAlreadyArchivedException;
use App\Modules\Customers\Models\Customer;
use Illuminate\Support\Facades\DB;

final class ArchiveCustomerAction
{
    public function execute(
        string $tenantId,
        string $customerId,
        int|string $actorId,
    ): Customer {
        return DB::transaction(function () use (
            $tenantId,
            $customerId,
            $actorId,
        ): Customer {
            $customer = Customer::query()
                ->where('tenant_id', $tenantId)
                ->whereKey($customerId)
                ->lockForUpdate()
                ->firstOrFail();

            if ($customer->isArchived()) {
                throw new CustomerAlreadyArchivedException();
            }

            $customer->forceFill([
                'status' => CustomerStatus::Archived,
                'archived_at' => now(),
                'archived_by' => $actorId,
                'restored_by' => null,
                'updated_by' => $actorId,
            ])->save();

            return $customer;
        });
    }
}
