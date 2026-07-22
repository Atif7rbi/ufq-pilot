<?php

declare(strict_types=1);

namespace App\Modules\Reservations\Casts;

use Carbon\CarbonImmutable;
use DateTimeInterface;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

final class UtcDateTimeCast implements CastsAttributes
{
    public function get(
        Model $model,
        string $key,
        mixed $value,
        array $attributes,
    ): ?CarbonImmutable {
        if ($value === null) {
            return null;
        }

        return CarbonImmutable::parse((string) $value, 'UTC');
    }

    public function set(
        Model $model,
        string $key,
        mixed $value,
        array $attributes,
    ): ?string {
        if ($value === null) {
            return null;
        }

        $date = $value instanceof DateTimeInterface
            ? CarbonImmutable::instance($value)
            : CarbonImmutable::parse(
                (string) $value,
                config('app.timezone'),
            );

        return $date->utc()->format('Y-m-d H:i:s');
    }
}
