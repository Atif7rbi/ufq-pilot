<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table): void {
            $table->id();

            $table->string('company_name_ar', 200);
            $table->string('company_name_en', 200)->nullable();
            $table->string('short_name_ar', 100);
            $table->string('short_name_en', 100)->nullable();

            $table->string('logo_path')->nullable();
            $table->string('favicon_path')->nullable();

            $table->string('primary_color', 7)->default('#0f172a');
            $table->string('secondary_color', 7)->default('#475569');

            $table->string('language', 10)->default('ar');
            $table->string('timezone', 100)->default('Asia/Riyadh');
            $table->string('currency', 3)->default('SAR');
            $table->string('date_format', 30)->default('Y-m-d');

            $table->string('phone', 30)->nullable();
            $table->string('email', 254)->nullable();
            $table->string('website', 255)->nullable();
            $table->text('address')->nullable();

            $table->string('commercial_registration', 100)->nullable();
            $table->string('vat_number', 100)->nullable();

            $table->timestamps();
        });

        DB::table('system_settings')->insert([
            'company_name_ar' => 'شركة أفق السكنية للتطوير العقاري',
            'company_name_en' => 'Ufq Housing Development Company',
            'short_name_ar' => 'أفق',
            'short_name_en' => 'Ufq',
            'primary_color' => '#0f172a',
            'secondary_color' => '#475569',
            'language' => 'ar',
            'timezone' => 'Asia/Riyadh',
            'currency' => 'SAR',
            'date_format' => 'Y-m-d',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
