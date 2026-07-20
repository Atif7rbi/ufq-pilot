<?php

declare(strict_types=1);

namespace App\Modules\Customers\Enums;

enum CustomerStatus: string
{
    case Lead = 'lead';
    case Customer = 'customer';
    case Inactive = 'inactive';
    case Archived = 'archived';

    /**
     * Statuses allowed through normal create/update operations.
     *
     * The archived status is managed exclusively through the
     * dedicated archive and restore state transitions.
     *
     * @return array<int, string>
     */
    public static function editableValues(): array
    {
        return [
            self::Lead->value,
            self::Customer->value,
            self::Inactive->value,
        ];
    }
}
