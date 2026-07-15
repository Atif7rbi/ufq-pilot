<?php

namespace App\Modules\Shared\Contracts;

interface BusinessNumberGeneratorInterface
{
    /**
     * @return array{
     *     number: string,
     *     year: int,
     *     sequence: int
     * }
     */
    public function generate(
        string $prefix,
        int $year,
        ?int $requestedSequence = null,
    ): array;
}
