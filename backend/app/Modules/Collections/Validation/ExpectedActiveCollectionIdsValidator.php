<?php

declare(strict_types=1);

namespace App\Modules\Collections\Validation;

use App\Modules\Collections\Exceptions\CollectionScheduleChangedSinceLoadedException;
use App\Modules\Collections\Exceptions\InvalidExpectedActiveCollectionIdsException;
use App\Modules\Collections\Models\Collection;
use Illuminate\Support\Str;

final class ExpectedActiveCollectionIdsValidator
{
    /**
     * @param  array<int, mixed>  $ids
     * @return array<int, string>
     */
    public function validateAndCanonicalize(array $ids): array
    {
        if ($ids === [] || ! array_is_list($ids)) {
            throw new InvalidExpectedActiveCollectionIdsException();
        }

        $canonical = [];
        $seen = [];

        foreach ($ids as $id) {
            if (! is_string($id)) {
                throw new InvalidExpectedActiveCollectionIdsException();
            }

            $normalized = strtoupper($id);

            if (! Str::isUlid($normalized) || isset($seen[$normalized])) {
                throw new InvalidExpectedActiveCollectionIdsException();
            }

            $seen[$normalized] = true;
            $canonical[] = $normalized;
        }

        sort($canonical, SORT_STRING);

        return $canonical;
    }

    /**
     * @param  array<int, string>  $expectedCanonicalIds
     * @param  array<int, Collection>  $activeCollections
     */
    public function assertMatchesActiveCollections(
        array $expectedCanonicalIds,
        array $activeCollections,
    ): void {
        $currentCanonicalIds = array_map(
            static fn (Collection $collection): string => strtoupper((string) $collection->getKey()),
            $activeCollections,
        );

        sort($currentCanonicalIds, SORT_STRING);

        if ($currentCanonicalIds !== $expectedCanonicalIds) {
            throw new CollectionScheduleChangedSinceLoadedException();
        }
    }
}
