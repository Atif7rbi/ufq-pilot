<?php

declare(strict_types=1);

namespace App\Modules\Units\Enums;

enum UnitType: string
{
    case Apartment = 'apartment';
    case Villa = 'villa';
    case Office = 'office';
    case Shop = 'shop';
    case Land = 'land';
    case Other = 'other';
}
