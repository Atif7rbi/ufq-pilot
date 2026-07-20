<?php

declare(strict_types=1);

namespace App\Modules\Customers\Enums;

enum CustomerCategory: string
{
    case Investor = 'investor';
    case Buyer = 'buyer';
    case Broker = 'broker';
    case Owner = 'owner';
    case Other = 'other';
}
