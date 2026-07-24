<?php

declare(strict_types=1);

namespace App\Modules\Projects\Exceptions;

use DomainException;

final class InvalidProjectStatusTransitionException extends DomainException
{
    public function __construct()
    {
        parent::__construct('انتقال حالة المشروع غير مسموح.');
    }
}
