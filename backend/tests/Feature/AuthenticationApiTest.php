<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthenticationApiTest extends ApiTestCase
{
    public function test_active_user_can_login_and_receive_token(): void
    {
        $this->createActiveUser([
            'name' => 'مدير النظام',
            'email' => 'admin@example.com',
            'password' => Hash::make('StrongPassword123!'),
            'role' => User::ROLE_ADMINISTRATOR,
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'StrongPassword123!',
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure([
                'message',
                'data' => [
                    'token',
                    'user' => [
                        'id',
                        'name',
                        'email',
                        'role',
                        'status',
                    ],
                ],
            ]);

        $this->assertDatabaseCount('personal_access_tokens', 1);
    }

    public function test_authenticated_user_can_fetch_profile_using_bearer_token(): void
    {
        [$user, $token] = $this->actingAsActiveUser();

        $this->withHeader(
            'Authorization',
            'Bearer '.$token
        )
            ->getJson('/api/auth/user')
            ->assertOk()
            ->assertJsonPath('data.user.id', $user->id);
    }

    public function test_logout_deletes_current_token_only(): void
    {
        [$user, $token] = $this->actingAsActiveUser([], 'device-1');

        $this->assertDatabaseCount('personal_access_tokens', 1);

        $this->withHeader(
            'Authorization',
            'Bearer '.$token
        )
            ->postJson('/api/auth/logout')
            ->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        $this->createActiveUser([
            'email' => 'admin@example.com',
            'password' => Hash::make('CorrectPassword123!'),
        ]);

        $this->postJson('/api/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'WrongPassword',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_suspended_user_cannot_login(): void
    {
        User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('StrongPassword123!'),
            'status' => User::STATUS_SUSPENDED,
        ]);

        $this->postJson('/api/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'StrongPassword123!',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_guest_cannot_access_protected_routes(): void
    {
        $this->getJson('/api/auth/user')
            ->assertUnauthorized();

        $this->postJson('/api/auth/logout')
            ->assertUnauthorized();
    }
}
