<?php

namespace Tests\Feature;

use App\Modules\Projects\Models\Project;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\Sanctum;

class ProjectsApiTest extends ApiTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Carbon::setTestNow('2026-07-15 12:00:00');
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function test_guest_cannot_access_projects(): void
    {
        $this->getJson('/api/projects')
            ->assertUnauthorized();

        $this->postJson('/api/projects', [])
            ->assertUnauthorized();
    }

    public function test_authenticated_user_can_create_project_with_generated_number(): void
    {
        $user = $this->createActiveUser();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/projects', [
            'name' => 'مشروع أفق السكني',
            'project_type' => 'residential',
            'city' => 'الرياض',
            'district' => 'الياسمين',
            'estimated_budget' => 2500000,
            'planned_start_date' => '2026-08-01',
            'planned_end_date' => '2027-08-01',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.project.project_number', 'PRJ-2026-001')
            ->assertJsonPath('data.project.project_number_year', 2026)
            ->assertJsonPath('data.project.project_sequence_number', 1)
            ->assertJsonPath('data.project.status', 'draft')
            ->assertJsonPath('data.project.data_origin', 'user');

        $this->assertDatabaseHas('projects', [
            'project_number' => 'PRJ-2026-001',
            'name' => 'مشروع أفق السكني',
            'project_type' => 'residential',
            'status' => 'draft',
            'city' => 'الرياض',
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);
    }

    public function test_project_numbers_increment_within_same_year(): void
    {
        $user = $this->createActiveUser();

        Sanctum::actingAs($user);

        $this->postJson('/api/projects', [
            'name' => 'المشروع الأول',
            'project_type' => 'residential',
            'city' => 'الرياض',
        ])->assertCreated();

        $this->postJson('/api/projects', [
            'name' => 'المشروع الثاني',
            'project_type' => 'commercial',
            'city' => 'جدة',
        ])
            ->assertCreated()
            ->assertJsonPath(
                'data.project.project_number',
                'PRJ-2026-002'
            );
    }

    public function test_user_can_request_custom_sequence_and_next_number_continues_after_it(): void
    {
        $user = $this->createActiveUser();

        Sanctum::actingAs($user);

        $this->postJson('/api/projects', [
            'sequence_number' => 55,
            'name' => 'مشروع برقم مخصص',
            'project_type' => 'mixed_use',
            'city' => 'الدمام',
        ])
            ->assertCreated()
            ->assertJsonPath(
                'data.project.project_number',
                'PRJ-2026-055'
            );

        $this->postJson('/api/projects', [
            'name' => 'المشروع التالي',
            'project_type' => 'residential',
            'city' => 'الخبر',
        ])
            ->assertCreated()
            ->assertJsonPath(
                'data.project.project_number',
                'PRJ-2026-056'
            );
    }

    public function test_authenticated_user_can_list_show_and_update_project(): void
    {
        $user = $this->createActiveUser();

        Sanctum::actingAs($user);

        $projectId = $this->postJson('/api/projects', [
            'name' => 'مشروع قبل التعديل',
            'project_type' => 'land',
            'city' => 'الرياض',
        ])
            ->assertCreated()
            ->json('data.project.id');

        $this->getJson('/api/projects')
            ->assertOk()
            ->assertJsonPath(
                'data.data.0.id',
                $projectId
            );

        $this->getJson("/api/projects/{$projectId}")
            ->assertOk()
            ->assertJsonPath(
                'data.project.name',
                'مشروع قبل التعديل'
            );
        $this->putJson("/api/projects/{$projectId}", [
            'name' => 'مشروع بعد التعديل',
            'status' => 'planning',
        ])
            ->assertOk()
            ->assertJsonPath(
                'data.project.name',
                'مشروع بعد التعديل'
            )
            ->assertJsonPath(
                'data.project.status',
                'planning'
            )
            ->assertJsonPath(
                'data.project.country_code',
                'SA'
            )
            ->assertJsonPath(
                'data.project.currency',
                'SAR'
            );

        $this->assertDatabaseHas('projects', [
            'id' => $projectId,
            'name' => 'مشروع بعد التعديل',
            'status' => 'planning',
            'updated_by' => $user->id,
        ]);
    }

    public function test_projects_can_be_filtered_by_search_status_and_page(): void
    {
        $user = $this->createActiveUser();

        Sanctum::actingAs($user);

        foreach ([
            ['name' => 'مشروع النخيل الأول', 'status' => 'active'],
            ['name' => 'مشروع النخيل الثاني', 'status' => 'active'],
            ['name' => 'مشروع الياسمين', 'status' => 'draft'],
        ] as $project) {
            $this->postJson('/api/projects', [
                ...$project,
                'project_type' => 'residential',
                'city' => 'الرياض',
            ])->assertCreated();
        }

        $this->getJson('/api/projects?search=النخيل&status=active&per_page=1&page=2')
            ->assertOk()
            ->assertJsonPath('data.total', 2)
            ->assertJsonPath('data.per_page', 1)
            ->assertJsonPath('data.current_page', 2)
            ->assertJsonPath('data.last_page', 2)
            ->assertJsonCount(1, 'data.data')
            ->assertJsonPath(
                'data.data.0.name',
                'مشروع النخيل الأول'
            );
    }

    public function test_authenticated_user_can_assign_and_remove_project_manager(): void
    {
        $user = $this->createActiveUser();
        $manager = $this->createActiveUser();

        Sanctum::actingAs($user);

        $projectId = $this->postJson('/api/projects', [
            'name' => 'مشروع بمدير',
            'project_type' => 'residential',
            'city' => 'الرياض',
            'project_manager_id' => $manager->id,
        ])
            ->assertCreated()
            ->assertJsonPath(
                'data.project.project_manager.id',
                $manager->id
            )
            ->assertJsonPath(
                'data.project.project_manager.name',
                $manager->name
            )
            ->json('data.project.id');

        $this->putJson("/api/projects/{$projectId}", [
            'project_manager_id' => null,
        ])
            ->assertOk()
            ->assertJsonPath(
                'data.project.project_manager_id',
                null
            )
            ->assertJsonPath(
                'data.project.project_manager',
                null
            );
    }

    public function test_project_validation_rejects_invalid_business_values(): void
    {
        $user = $this->createActiveUser();

        Sanctum::actingAs($user);

        $this->postJson('/api/projects', [
            'sequence_number' => 0,
            'name' => '',
            'project_type' => 'invalid_type',
            'city' => '',
            'estimated_budget' => -1,
            'planned_start_date' => '2026-12-31',
            'planned_end_date' => '2026-01-01',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'sequence_number',
                'name',
                'project_type',
                'city',
                'estimated_budget',
                'planned_end_date',
            ]);
    }

    public function test_authenticated_user_can_soft_delete_project(): void
    {
        $user = $this->createActiveUser();

        Sanctum::actingAs($user);

        $projectId = $this->postJson('/api/projects', [
            'name' => 'مشروع للحذف',
            'project_type' => 'villa',
            'city' => 'الرياض',
        ])
            ->assertCreated()
            ->json('data.project.id');

        $this->deleteJson("/api/projects/{$projectId}")
            ->assertOk()
            ->assertJsonPath(
                'message',
                'تم حذف المشروع بنجاح.'
            );

        $this->assertSoftDeleted('projects', [
            'id' => $projectId,
            'updated_by' => $user->id,
        ]);

        $this->assertNull(
            Project::query()->find($projectId)
        );
    }
}
