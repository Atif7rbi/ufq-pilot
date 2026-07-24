<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::table('projects')->whereNull('tenant_id')->exists()) {
            throw new \RuntimeException(
                'Cannot require projects.tenant_id while NULL values exist.'
            );
        }

        DB::statement(
            'ALTER TABLE projects ALTER COLUMN tenant_id SET NOT NULL'
        );
    }

    public function down(): void
    {
        DB::statement(
            'ALTER TABLE projects ALTER COLUMN tenant_id DROP NOT NULL'
        );
    }
};
