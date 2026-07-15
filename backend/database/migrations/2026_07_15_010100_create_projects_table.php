<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table): void {
            $table->ulid('id')->primary();

            $table->string('project_number', 50)->unique();
            $table->unsignedSmallInteger('project_number_year');
            $table->unsignedBigInteger('project_sequence_number');

            $table->string('name');
            $table->text('description')->nullable();

            $table->string('project_type', 30);
            $table->string('status', 20)->default('draft');

            $table->char('country_code', 2)->default('SA');
            $table->string('city', 120);
            $table->string('district', 120)->nullable();
            $table->string('address_line', 500)->nullable();

            $table->char('currency', 3)->default('SAR');
            $table->decimal('estimated_budget', 15, 2)->nullable();

            $table->date('planned_start_date')->nullable();
            $table->date('planned_end_date')->nullable();
            $table->date('actual_start_date')->nullable();
            $table->date('actual_end_date')->nullable();

            $table->foreignId('project_manager_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('data_origin', 20)->default('user');
            $table->string('external_reference', 255)->nullable();
            $table->string('legacy_reference', 255)->nullable();

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestampsTz();
            $table->softDeletesTz();

            $table->unique(
                [
                    'project_number_year',
                    'project_sequence_number',
                ],
                'projects_year_sequence_unique'
            );

            $table->index('status');
            $table->index('project_type');
            $table->index('city');
            $table->index('project_manager_id');
            $table->index('deleted_at');
        });

        DB::statement("
            ALTER TABLE projects
            ADD CONSTRAINT projects_type_check
            CHECK (project_type IN (
                'residential',
                'commercial',
                'mixed_use',
                'land',
                'villa',
                'tower',
                'compound',
                'warehouse',
                'other'
            ))
        ");

        DB::statement("
            ALTER TABLE projects
            ADD CONSTRAINT projects_status_check
            CHECK (status IN (
                'draft',
                'planning',
                'active',
                'completed',
                'archived',
                'cancelled'
            ))
        ");

        DB::statement("
            ALTER TABLE projects
            ADD CONSTRAINT projects_data_origin_check
            CHECK (data_origin IN (
                'user',
                'import',
                'system',
                'demo'
            ))
        ");

        DB::statement('
            ALTER TABLE projects
            ADD CONSTRAINT projects_estimated_budget_check
            CHECK (
                estimated_budget IS NULL
                OR estimated_budget >= 0
            )
        ');

        DB::statement('
            ALTER TABLE projects
            ADD CONSTRAINT projects_planned_dates_check
            CHECK (
                planned_start_date IS NULL
                OR planned_end_date IS NULL
                OR planned_end_date >= planned_start_date
            )
        ');

        DB::statement('
            ALTER TABLE projects
            ADD CONSTRAINT projects_actual_dates_check
            CHECK (
                actual_start_date IS NULL
                OR actual_end_date IS NULL
                OR actual_end_date >= actual_start_date
            )
        ');

        DB::statement("
            ALTER TABLE projects
            ADD CONSTRAINT projects_country_code_check
            CHECK (country_code ~ '^[A-Z]{2}$')
        ");

        DB::statement("
            ALTER TABLE projects
            ADD CONSTRAINT projects_currency_check
            CHECK (currency ~ '^[A-Z]{3}$')
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
