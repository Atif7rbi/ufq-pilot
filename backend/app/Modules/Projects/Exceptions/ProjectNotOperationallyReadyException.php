<?php

declare(strict_types=1);

namespace App\Modules\Projects\Exceptions;

use DomainException;

final class ProjectNotOperationallyReadyException extends DomainException
{
    public function __construct()
    {
        parent::__construct('المشروع غير جاهز تشغيليًا للتفعيل.');
    }
}
