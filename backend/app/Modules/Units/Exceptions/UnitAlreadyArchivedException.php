<?php

declare(strict_types=1);

namespace App\Modules\Units\Exceptions;

use DomainException;

final class UnitAlreadyArchivedException extends DomainException
{
    public function __construct()
    {
        parent::__construct('الوحدة مؤرشفة بالفعل.');
    }
}
