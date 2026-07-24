<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add the Phase 1 Project Domain columns without changing behavior.
     *
     * Tenant ownership and legacy archive/lifecycle resolution are separate
     * business remediation phases. These columns must remain nullable until
     * those phases are complete.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table): void {
            $table->foreignUlid('tenant_id')
                ->nullable()
                ->after('id')
                ->constrained('tenants')
                ->restrictOnUpdate()
                ->restrictOnDelete();

            $table->timestampTz('archived_at')
                ->nullable()
                ->after('updated_by');

            $table->foreignId('archived_by')
                ->nullable()
                ->after('archived_at')
                ->constrained('users')
                ->restrictOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('restored_by')
                ->nullable()
                ->after('archived_by')
                ->constrained('users')
                ->restrictOnUpdate()
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table): void {
            $table->dropForeign(['restored_by']);
            $table->dropForeign(['archived_by']);
            $table->dropForeign(['tenant_id']);

            $table->dropColumn([
                'restored_by',
                'archived_by',
                'archived_at',
                'tenant_id',
            ]);
        });
    }
};
