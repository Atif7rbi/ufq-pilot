<?php

declare(strict_types=1);

namespace App\Modules\Reservations\Policies;

use DateInterval;

final class ReservationPolicy
{
    public static function defaultDuration(): DateInterval
    {
        return new DateInterval('PT48H');
    }
}
