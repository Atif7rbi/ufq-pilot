<?php

declare(strict_types=1);

namespace App\Modules\Customers\Exceptions;

use DomainException;

final class ArchivedCustomerCannotBeUpdatedException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            'لا يمكن تعديل عميل مؤرشف. يجب استعادته أولًا.'
        );
    }
}
