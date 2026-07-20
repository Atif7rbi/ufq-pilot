<?php

declare(strict_types=1);

namespace App\Modules\Customers\Actions;

use App\Modules\Customers\Enums\CustomerStatus;
use App\Modules\Customers\Models\Customer;
use Illuminate\Support\Facades\DB;

final class CreateCustomerAction
{
    public function execute(
        string $tenantId,
        int|string $actorId,
        array $data,
    ): Customer {
        return DB::transaction(function () use (
            $tenantId,
            $actorId,
            $data,
        ): Customer {
            unset(
                $data['tenant_id'],
                $data['created_by'],
                $data['updated_by'],
                $data['archived_by'],
                $data['restored_by'],
                $data['archived_at'],
            );

            $data['tenant_id'] = $tenantId;
            $data['status'] ??= CustomerStatus::Lead->value;
            $data['created_by'] = $actorId;
            $data['updated_by'] = $actorId;

            return Customer::query()->create($data);
        });
    }
}
