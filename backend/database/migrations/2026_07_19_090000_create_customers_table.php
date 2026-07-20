<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table): void {
            $table->ulid('id')->primary();

            $table->foreignUlid('tenant_id')
                ->constrained('tenants')
                ->restrictOnDelete();

            $table->string('type', 20);
            $table->string('category', 30);
            $table->string('status', 20)
                ->default('lead');

            $table->string('name', 255);
            $table->string('phone', 30);
            $table->string('email', 255)
                ->nullable();

            $table->string('national_id', 50)
                ->nullable();

            $table->string(
                'commercial_registration_number',
                50
            )->nullable();

            $table->string('city', 120)
                ->nullable();

            $table->string('address', 500)
                ->nullable();

            $table->text('notes')
                ->nullable();

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('archived_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('restored_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestampTz('archived_at')
                ->nullable();

            $table->timestampsTz();

            $table->unique(
                ['tenant_id', 'phone'],
                'customers_tenant_phone_unique'
            );

            $table->index(
                ['tenant_id', 'status'],
                'customers_tenant_status_index'
            );

            $table->index(
                ['tenant_id', 'type'],
                'customers_tenant_type_index'
            );

            $table->index(
                ['tenant_id', 'category'],
                'customers_tenant_category_index'
            );

            $table->index(
                ['tenant_id', 'name'],
                'customers_tenant_name_index'
            );

            $table->index(
                ['tenant_id', 'created_at'],
                'customers_tenant_created_at_index'
            );

            $table->index('phone');
            $table->index('national_id');
            $table->index(
                'commercial_registration_number',
                'customers_cr_number_index'
            );
            $table->index('archived_at');
        });

        DB::statement("
            ALTER TABLE customers
            ADD CONSTRAINT customers_type_check
            CHECK (
                type IN (
                    'individual',
                    'company'
                )
            )
        ");

        DB::statement("
            ALTER TABLE customers
            ADD CONSTRAINT customers_category_check
            CHECK (
                category IN (
                    'investor',
                    'buyer',
                    'broker',
                    'owner',
                    'other'
                )
            )
        ");

        DB::statement("
            ALTER TABLE customers
            ADD CONSTRAINT customers_status_check
            CHECK (
                status IN (
                    'lead',
                    'customer',
                    'inactive',
                    'archived'
                )
            )
        ");

        DB::statement("
            ALTER TABLE customers
            ADD CONSTRAINT customers_identity_type_check
            CHECK (
                (
                    type = 'individual'
                    AND commercial_registration_number IS NULL
                )
                OR
                (
                    type = 'company'
                    AND national_id IS NULL
                )
            )
        ");

        DB::statement("
            ALTER TABLE customers
            ADD CONSTRAINT customers_archive_state_check
            CHECK (
                (
                    status = 'archived'
                    AND archived_at IS NOT NULL
                    AND archived_by IS NOT NULL
                )
                OR
                (
                    status <> 'archived'
                    AND archived_at IS NULL
                    AND archived_by IS NULL
                )
            )
        ");

        DB::statement("
            CREATE UNIQUE INDEX
                customers_tenant_national_id_unique
            ON customers (
                tenant_id,
                national_id
            )
            WHERE national_id IS NOT NULL
        ");

        DB::statement("
            CREATE UNIQUE INDEX
                customers_tenant_cr_number_unique
            ON customers (
                tenant_id,
                commercial_registration_number
            )
            WHERE commercial_registration_number IS NOT NULL
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
