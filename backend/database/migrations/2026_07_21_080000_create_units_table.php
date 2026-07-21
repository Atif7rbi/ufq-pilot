<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table): void {
            $table->ulid('id')->primary();

            $table->foreignUlid('tenant_id')
                ->constrained('tenants')
                ->restrictOnDelete();

            $table->foreignUlid('project_id')
                ->constrained('projects')
                ->restrictOnDelete();

            $table->string('unit_number', 50);
            $table->string('unit_type', 20);
            $table->string('status', 20)
                ->default('available');
            $table->decimal('selling_price', 15, 2);

            $table->decimal('area', 12, 2)
                ->nullable();
            $table->integer('floor')
                ->nullable();
            $table->unsignedSmallInteger('bedrooms')
                ->nullable();
            $table->unsignedSmallInteger('bathrooms')
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
                ['project_id', 'unit_number'],
                'units_project_number_unique'
            );

            $table->index(
                ['tenant_id', 'status'],
                'units_tenant_status_index'
            );

            $table->index(
                ['tenant_id', 'project_id'],
                'units_tenant_project_index'
            );

            $table->index('archived_at');
        });

        DB::statement("
            ALTER TABLE units
            ADD CONSTRAINT units_type_check
            CHECK (
                unit_type IN (
                    'apartment',
                    'villa',
                    'office',
                    'shop',
                    'land',
                    'other'
                )
            )
        ");

        DB::statement("
            ALTER TABLE units
            ADD CONSTRAINT units_status_check
            CHECK (status IN ('available', 'sold'))
        ");

        DB::statement('
            ALTER TABLE units
            ADD CONSTRAINT units_selling_price_check
            CHECK (selling_price >= 0)
        ');

        DB::statement('
            ALTER TABLE units
            ADD CONSTRAINT units_archive_state_check
            CHECK (
                (archived_at IS NULL AND archived_by IS NULL)
                OR
                (archived_at IS NOT NULL AND archived_by IS NOT NULL)
            )
        ');
    }

    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
