<?php

namespace App\Modules\Projects\Enums;

enum ProjectStatus: string
{
    case Draft = 'draft';
    case Planning = 'planning';
    case Active = 'active';
    case Completed = 'completed';
    case Archived = 'archived';
    case Cancelled = 'cancelled';
}
