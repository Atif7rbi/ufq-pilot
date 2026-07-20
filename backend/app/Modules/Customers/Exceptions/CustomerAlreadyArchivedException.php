<?php

declare(strict_types=1);

namespace App\Modules\Customers\Exceptions;

use DomainException;

final class CustomerAlreadyArchivedException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            'العميل مؤرشف بالفعل.'
        );
    }
}
