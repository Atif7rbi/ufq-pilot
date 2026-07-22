<?php

declare(strict_types=1);

namespace App\Modules\Reservations\Exceptions;

use DomainException;

final class ReservationUnitUnavailableException extends DomainException
{
    public function __construct()
    {
        parent::__construct('الوحدة غير متاحة للحجز.');
    }
}
