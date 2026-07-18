<?php

namespace Tests\Support;

use App\Models\Tenant;
use App\Models\TenantUser;
use App\Models\User;

trait CreatesActiveMembership
{
    protected function createActiveUser(array $attributes = []): User
    {
        $tenant = Tenant::factory()->create();

        $user = User::factory()->create(array_merge([
            'status' => User::STATUS_ACTIVE,
        ], $attributes));

        TenantUser::factory()
            ->forTenant($tenant)
            ->forUser($user)
            ->active()
            ->create();

        return $user;
    }

    protected function createPausedUser(array $attributes = []): User
    {
        $tenant = Tenant::factory()->create();

        $user = User::factory()->create(array_merge([
            'status' => User::STATUS_ACTIVE,
        ], $attributes));

        TenantUser::factory()
            ->forTenant($tenant)
            ->forUser($user)
            ->paused()
            ->create();

        return $user;
    }

    protected function createSuspendedUser(array $attributes = []): User
    {
        $tenant = Tenant::factory()->create();

        $user = User::factory()->create(array_merge([
            'status' => User::STATUS_ACTIVE,
        ], $attributes));

        TenantUser::factory()
            ->forTenant($tenant)
            ->forUser($user)
            ->suspended()
            ->create();

        return $user;
    }

    protected function createRemovedUser(array $attributes = []): User
    {
        $tenant = Tenant::factory()->create();

        $user = User::factory()->create(array_merge([
            'status' => User::STATUS_ACTIVE,
        ], $attributes));

        TenantUser::factory()
            ->forTenant($tenant)
            ->forUser($user)
            ->removed()
            ->create();

        return $user;
    }

    protected function createAccessToken(
        User $user,
        string $name = 'test',
    ): string {
        return $user->createToken($name)->plainTextToken;
    }

    protected function actingAsActiveUser(
        array $attributes = [],
        string $tokenName = 'test',
    ): array {
        $user = $this->createActiveUser($attributes);

        return [
            $user,
            $this->createAccessToken($user, $tokenName),
        ];
    }
}
