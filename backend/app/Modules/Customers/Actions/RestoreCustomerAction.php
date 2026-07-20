<?php

declare(strict_types=1);

namespace App\Modules\Customers\Actions;

use App\Modules\Customers\Enums\CustomerStatus;
use App\Modules\Customers\Exceptions\CustomerNotArchivedException;
use App\Modules\Customers\Models\Customer;
use Illuminate\Support\Facades\DB;

final class RestoreCustomerAction
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

            if (! $customer->isArchived()) {
                throw new CustomerNotArchivedException();
            }

            $customer->forceFill([
                'status' => CustomerStatus::Inactive,
                'archived_at' => null,
                'archived_by' => null,
                'restored_by' => $actorId,
                'updated_by' => $actorId,
            ])->save();

            return $customer;
        });
    }
}
