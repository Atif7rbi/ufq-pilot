<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\CreatesActiveMembership;
use Tests\TestCase;

abstract class ApiTestCase extends TestCase
{
    use RefreshDatabase;
    use CreatesActiveMembership;
}
