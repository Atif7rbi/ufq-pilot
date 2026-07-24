<?php

declare(strict_types=1);

namespace App\Modules\Projects\Exceptions;

use DomainException;

final class ProjectNotOperationallyCompleteException extends DomainException
{
    public function __construct()
    {
        parent::__construct('المشروع لا يحقق متطلبات الإكمال التشغيلي.');
    }
}
