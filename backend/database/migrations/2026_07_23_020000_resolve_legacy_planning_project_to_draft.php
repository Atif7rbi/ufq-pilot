<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        /*
         * Phase 2.5 explicit business resolution.
         *
         * PRJ-2026-004 was a historical test/demo project that never entered
         * operational execution. Its legacy planning status is resolved to
         * draft by an explicit business decision; this is not a general
         * planning-to-draft migration rule.
         */
        DB::table('projects')
            ->where('id', '01kxkx9k9b6snmard931m307zm')
            ->where('project_number', 'PRJ-2026-004')
            ->where('status', 'planning')
            ->update([
                'status' => 'draft',
            ]);
    }

    public function down(): void
    {
        // A business-data resolution is not reversed automatically.
    }
};
