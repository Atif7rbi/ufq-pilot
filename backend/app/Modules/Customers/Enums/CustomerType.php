<?php

declare(strict_types=1);

namespace App\Modules\Customers\Enums;

enum CustomerType: string
{
    case Individual = 'individual';
    case Company = 'company';
}
