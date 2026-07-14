<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('role', 30)
                ->default('employee')
                ->after('email');

            $table->string('status', 20)
                ->default('active')
                ->after('role');

            $table->string('phone', 30)
                ->nullable()
                ->after('status');

            $table->timestampTz('last_login_at')
                ->nullable()
                ->after('remember_token');

            $table->index('role');
            $table->index('status');
        });

        DB::statement("
            ALTER TABLE users
            ADD CONSTRAINT users_role_check
            CHECK (role IN (
                'administrator',
                'project_manager',
                'sales',
                'accountant',
                'employee'
            ))
        ");

        DB::statement("
            ALTER TABLE users
            ADD CONSTRAINT users_status_check
            CHECK (status IN ('active', 'suspended', 'archived'))
        ");
    }

    public function down(): void
    {
        DB::statement(
            'ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check'
        );

        DB::statement(
            'ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check'
        );

        Schema::table('users', function (Blueprint $table): void {
            $table->dropIndex(['role']);
            $table->dropIndex(['status']);

            $table->dropColumn([
                'role',
                'status',
                'phone',
                'last_login_at',
            ]);
        });
    }
};
