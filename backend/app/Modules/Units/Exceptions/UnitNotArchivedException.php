<?php

declare(strict_types=1);

namespace App\Modules\Units\Exceptions;

use DomainException;

final class UnitNotArchivedException extends DomainException
{
    public function __construct()
    {
        parent::__construct('لا يمكن استعادة وحدة غير مؤرشفة.');
    }
}
