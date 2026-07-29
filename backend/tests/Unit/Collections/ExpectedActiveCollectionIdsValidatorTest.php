<?php

declare(strict_types=1);

namespace Tests\Unit\Collections;

use App\Modules\Collections\Exceptions\InvalidExpectedActiveCollectionIdsException;
use App\Modules\Collections\Validation\ExpectedActiveCollectionIdsValidator;
use PHPUnit\Framework\TestCase;

final class ExpectedActiveCollectionIdsValidatorTest extends TestCase
{
    private ExpectedActiveCollectionIdsValidator $validator;

    protected function setUp(): void
    {
        parent::setUp();

        $this->validator = new ExpectedActiveCollectionIdsValidator();
    }

    public function test_valid_ids_are_canonicalized_and_sorted(): void
    {
        $result = $this->validator->validateAndCanonicalize([
            '01bx5zzkbkactav9wevgemmvry',
            '01ARZ3NDEKTSV4RRFFQ69G5FAV',
        ]);

        $this->assertSame([
            '01ARZ3NDEKTSV4RRFFQ69G5FAV',
            '01BX5ZZKBKACTAV9WEVGEMMVRY',
        ], $result);
    }

    public function test_empty_list_is_rejected(): void
    {
        $this->expectException(InvalidExpectedActiveCollectionIdsException::class);

        $this->validator->validateAndCanonicalize([]);
    }

    public function test_associative_array_is_rejected(): void
    {
        $this->expectException(InvalidExpectedActiveCollectionIdsException::class);

        $this->validator->validateAndCanonicalize([
            'first' => '01ARZ3NDEKTSV4RRFFQ69G5FAV',
        ]);
    }

    public function test_non_string_item_is_rejected(): void
    {
        $this->expectException(InvalidExpectedActiveCollectionIdsException::class);

        $this->validator->validateAndCanonicalize([123]);
    }

    public function test_invalid_ulid_is_rejected(): void
    {
        $this->expectException(InvalidExpectedActiveCollectionIdsException::class);

        $this->validator->validateAndCanonicalize(['not-a-ulid']);
    }

    public function test_duplicates_are_rejected_after_canonicalization(): void
    {
        $this->expectException(InvalidExpectedActiveCollectionIdsException::class);

        $this->validator->validateAndCanonicalize([
            '01ARZ3NDEKTSV4RRFFQ69G5FAV',
            '01arz3ndektsv4rrffq69g5fav',
        ]);
    }
}
