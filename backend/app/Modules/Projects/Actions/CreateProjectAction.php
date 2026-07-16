<?php

namespace App\Modules\Projects\Actions;

use App\Models\SystemSetting;
use App\Models\User;
use App\Modules\Projects\Enums\ProjectStatus;
use App\Modules\Projects\Models\Project;
use App\Modules\Shared\Contracts\BusinessNumberGeneratorInterface;
use App\Modules\Shared\Enums\DataOrigin;
use Illuminate\Support\Facades\DB;

class CreateProjectAction
{
    public function __construct(
        private readonly BusinessNumberGeneratorInterface $numberGenerator,
    ) {
    }

    public function execute(array $data, User $actor): Project
    {
        return DB::transaction(function () use ($data, $actor): Project {
            $timezone = SystemSetting::query()->value('timezone')
                ?? config('app.timezone');

            $year = now($timezone)->year;

            $number = $this->numberGenerator->generate(
                prefix: 'PRJ',
                year: $year,
                requestedSequence: isset($data['sequence_number'])
                    ? (int) $data['sequence_number']
                    : null,
            );

            unset($data['sequence_number']);

            $data['project_number'] = $number['number'];
            $data['project_number_year'] = $number['year'];
            $data['project_sequence_number'] = $number['sequence'];
            $data['status'] ??= ProjectStatus::Draft->value;
            $data['country_code'] = 'SA';
            $data['currency'] = 'SAR';
            $data['data_origin'] = DataOrigin::User->value;
            $data['created_by'] = $actor->id;
            $data['updated_by'] = $actor->id;

            return Project::query()->create($data);
        });
    }
}
