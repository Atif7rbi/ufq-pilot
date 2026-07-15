<?php

namespace App\Modules\Projects\Enums;

enum ProjectType: string
{
    case Residential = 'residential';
    case Commercial = 'commercial';
    case MixedUse = 'mixed_use';
    case Land = 'land';
    case Villa = 'villa';
    case Tower = 'tower';
    case Compound = 'compound';
    case Warehouse = 'warehouse';
    case Other = 'other';
}
