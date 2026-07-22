<?php

declare(strict_types=1);

namespace App\Modules\Reservations\Exceptions;

use DomainException;

final class ReservationNotActiveException extends DomainException
{
    public function __construct()
    {
        parent::__construct('لا يمكن تعديل أو إلغاء حجز غير نشط.');
    }
}
