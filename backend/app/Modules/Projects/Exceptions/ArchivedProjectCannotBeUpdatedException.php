<?php

declare(strict_types=1);

namespace App\Modules\Projects\Exceptions;

use DomainException;

final class ArchivedProjectCannotBeUpdatedException extends DomainException
{
    public function __construct()
    {
        parent::__construct('لا يمكن تعديل مشروع مؤرشف.');
    }
}
