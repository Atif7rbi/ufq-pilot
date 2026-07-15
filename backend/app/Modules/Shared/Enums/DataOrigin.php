<?php

namespace App\Modules\Shared\Enums;

enum DataOrigin: string
{
    case User = 'user';
    case Import = 'import';
    case System = 'system';
    case Demo = 'demo';
}
