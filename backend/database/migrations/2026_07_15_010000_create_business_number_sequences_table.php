<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'business_number_sequences',
            function (Blueprint $table): void {
                $table->id();
                $table->string('prefix', 10);
                $table->unsignedSmallInteger('year');
                $table->unsignedBigInteger('current_value')
                    ->default(0);
                $table->timestamps();

                $table->unique(
                    ['prefix', 'year'],
                    'business_number_sequences_prefix_year_unique'
                );
            }
        );

        DB::statement('
            ALTER TABLE business_number_sequences
            ADD CONSTRAINT business_number_sequences_year_check
            CHECK (year BETWEEN 2000 AND 9999)
        ');
    }

    public function down(): void
    {
        Schema::dropIfExists('business_number_sequences');
    }
};
