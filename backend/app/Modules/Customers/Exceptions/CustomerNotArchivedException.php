<?php

declare(strict_types=1);

namespace App\Modules\Customers\Exceptions;

use DomainException;

final class CustomerNotArchivedException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            'لا يمكن استعادة عميل غير مؤرشف.'
        );
    }
}
