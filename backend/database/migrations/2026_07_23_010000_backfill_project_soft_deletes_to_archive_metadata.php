<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('projects')
            ->whereNotNull('deleted_at')
            ->whereNull('archived_at')
            ->update([
                'archived_at' => DB::raw('deleted_at'),
            ]);
    }

    public function down(): void
    {
        // Phase 2 preserves migrated archive metadata during rollback.
    }
};
