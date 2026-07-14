<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('system_settings', function (Blueprint $table): void {
            $table->string('company_tagline_ar', 200)
                ->nullable()
                ->after('short_name_en');

            $table->string('company_tagline_en', 200)
                ->nullable()
                ->after('company_tagline_ar');
        });

        DB::table('system_settings')
            ->where('id', 1)
            ->update([
                'company_name_ar' => 'شركة أفق السكنية',
                'company_tagline_ar' => 'للتطوير العقاري',
                'company_name_en' => 'Ufq Housing Company',
                'company_tagline_en' => 'Real Estate Development',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        Schema::table('system_settings', function (Blueprint $table): void {
            $table->dropColumn([
                'company_tagline_ar',
                'company_tagline_en',
            ]);
        });
    }
};
