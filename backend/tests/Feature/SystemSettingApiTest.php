<?php

namespace Tests\Feature;

use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SystemSettingApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_read_system_settings(): void
    {
        $response = $this->getJson('/api/system-settings');

        $response
            ->assertOk()
            ->assertJsonPath(
                'data.company_name_ar',
                'شركة أفق السكنية'
            )
            ->assertJsonPath('data.short_name_ar', 'أفق')
            ->assertJsonPath('data.timezone', 'Asia/Riyadh')
            ->assertJsonPath('data.currency', 'SAR');
    }

    public function test_guest_cannot_update_system_settings(): void
    {
        $response = $this->putJson('/api/system-settings', [
            'short_name_ar' => 'اختبار',
        ]);

        $response->assertUnauthorized();
    }

    public function test_authenticated_user_can_update_system_settings(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->putJson('/api/system-settings', [
            'company_name_ar' => 'شركة الاختبار',
            'short_name_ar' => 'اختبار',
            'primary_color' => '#123456',
            'secondary_color' => '#654321',
            'language' => 'ar',
            'timezone' => 'Asia/Riyadh',
            'currency' => 'SAR',
            'date_format' => 'Y-m-d',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('message', 'تم تحديث إعدادات النظام بنجاح.')
            ->assertJsonPath('data.company_name_ar', 'شركة الاختبار')
            ->assertJsonPath('data.short_name_ar', 'اختبار')
            ->assertJsonPath('data.primary_color', '#123456');

        $this->assertDatabaseHas('system_settings', [
            'company_name_ar' => 'شركة الاختبار',
            'short_name_ar' => 'اختبار',
            'primary_color' => '#123456',
            'secondary_color' => '#654321',
        ]);
    }

    public function test_update_rejects_invalid_branding_and_regional_values(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->putJson('/api/system-settings', [
            'primary_color' => 'blue',
            'secondary_color' => '#12345',
            'timezone' => 'Invalid/Timezone',
            'currency' => 'SA',
            'email' => 'invalid-email',
            'website' => 'not-a-url',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'primary_color',
                'secondary_color',
                'timezone',
                'currency',
                'email',
                'website',
            ]);
    }

    public function test_partial_update_preserves_existing_values(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $settings = SystemSetting::query()->firstOrFail();

        $originalCompanyName = $settings->company_name_ar;
        $originalCurrency = $settings->currency;

        $response = $this->putJson('/api/system-settings', [
            'phone' => '+966500000000',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.phone', '+966500000000')
            ->assertJsonPath('data.company_name_ar', $originalCompanyName)
            ->assertJsonPath('data.currency', $originalCurrency);
    }
}
