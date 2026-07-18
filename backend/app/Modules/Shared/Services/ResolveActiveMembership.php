<?php

namespace App\Modules\Shared\Services;

use App\Models\TenantUser;
use App\Models\User;
use App\Modules\Shared\Exceptions\TenantMembershipMissingException;
use App\Modules\Shared\Exceptions\TenantMembershipPausedException;
use App\Modules\Shared\Exceptions\TenantMembershipRemovedException;
use App\Modules\Shared\Exceptions\TenantMembershipSuspendedException;

class ResolveActiveMembership
{
    public function handle(User $user): TenantUser
    {
        $membership = TenantUser::query()
            ->where('user_id', $user->id)
            ->first();

        if ($membership === null) {
            throw new TenantMembershipMissingException();
        }

        return match ($membership->status) {
            TenantUser::STATUS_ACTIVE => $membership,

            TenantUser::STATUS_PAUSED =>
                throw new TenantMembershipPausedException(),

            TenantUser::STATUS_SUSPENDED =>
                throw new TenantMembershipSuspendedException(),

            TenantUser::STATUS_REMOVED =>
                throw new TenantMembershipRemovedException(),

            default =>
                throw new TenantMembershipMissingException(),
        };
    }
}
