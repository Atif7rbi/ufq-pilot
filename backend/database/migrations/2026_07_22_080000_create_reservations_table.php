<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table): void {
            $table->ulid('id')->primary();

            $table->foreignUlid('tenant_id')->constrained('tenants')->restrictOnDelete();
            $table->foreignUlid('unit_id')->constrained('units')->restrictOnDelete();
            $table->foreignUlid('customer_id')->constrained('customers')->restrictOnDelete();
            $table->string('status', 20)->default('active');
            $table->timestampTz('reserved_at');
            $table->timestampTz('expires_at');
            $table->text('notes')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestampTz('cancelled_at')->nullable();
            $table->foreignId('cancelled_by')->nullable()->constrained('users')->restrictOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestampsTz();

            $table->index(['tenant_id', 'status'], 'reservations_tenant_status_index');
            $table->index(['tenant_id', 'unit_id'], 'reservations_tenant_unit_index');
            $table->index(['tenant_id', 'customer_id'], 'reservations_tenant_customer_index');
            $table->index('expires_at');
        });

        DB::statement("ALTER TABLE reservations ADD CONSTRAINT reservations_status_check CHECK (status IN ('active', 'cancelled', 'expired'))");
        DB::statement('ALTER TABLE reservations ADD CONSTRAINT reservations_expiry_after_reservation_check CHECK (expires_at > reserved_at)');
        DB::statement("ALTER TABLE reservations ADD CONSTRAINT reservations_cancellation_state_check CHECK ((status = 'cancelled' AND cancelled_at IS NOT NULL AND cancelled_by IS NOT NULL) OR (status <> 'cancelled' AND cancelled_at IS NULL AND cancelled_by IS NULL))");
        DB::statement("CREATE UNIQUE INDEX reservations_one_active_per_unit_unique ON reservations (unit_id) WHERE status = 'active'");
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
