<?php

namespace Database\Factories;

use App\Models\Tenant;
use App\Models\TenantUser;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TenantUser>
 */
class TenantUserFactory extends Factory
{
    protected $model = TenantUser::class;

    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'user_id' => User::factory(),
            'status' => TenantUser::STATUS_ACTIVE,
            'invited_at' => now(),
            'joined_at' => now(),
            'removed_at' => null,
            'created_by' => null,
            'updated_by' => null,
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => [
            'status' => TenantUser::STATUS_ACTIVE,
            'joined_at' => now(),
            'removed_at' => null,
        ]);
    }

    public function paused(): static
    {
        return $this->state(fn () => [
            'status' => TenantUser::STATUS_PAUSED,
        ]);
    }

    public function suspended(): static
    {
        return $this->state(fn () => [
            'status' => TenantUser::STATUS_SUSPENDED,
        ]);
    }

    public function removed(): static
    {
        return $this->state(fn () => [
            'status' => TenantUser::STATUS_REMOVED,
            'removed_at' => now(),
        ]);
    }

    public function forUser(User $user): static
    {
        return $this->state(fn () => [
            'user_id' => $user->id,
        ]);
    }

    public function forTenant(Tenant $tenant): static
    {
        return $this->state(fn () => [
            'tenant_id' => $tenant->id,
        ]);
    }
}
