<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WorkhubPagesTest extends TestCase
{
    public function test_dashboard_page_returns_successful_response(): void
    {
        $this->actingAs(User::factory()->create());

        $response = $this->get('/dashboard');

        $response->assertStatus(200);
    }

    public function test_dashboard_uses_live_project_and_task_metrics(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $projects = Project::factory()->count(3)->create([
            'owner_id' => $user->id,
        ]);

        foreach ($projects as $project) {
            Task::factory()->count(2)->create([
                'project_id' => $project->id,
                'assignee_id' => $user->id,
                'status' => 'todo',
            ]);
        }

        $response = $this->get('/dashboard');

        $response->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->has('stats')
                ->has('priorities')
                ->where('stats.0.label', 'Active Projects')
                ->where('stats.0.value', '3')
                ->where('stats.1.label', 'Open Tasks')
                ->where('stats.1.value', '6')
            );
    }

    public function test_dashboard_exposes_team_workload_summary(): void
    {
        $user = User::factory()->create();
        $teammate = User::factory()->create();
        $this->actingAs($user);

        $project = Project::factory()->create([
            'owner_id' => $user->id,
        ]);

        Task::factory()->create([
            'project_id' => $project->id,
            'assignee_id' => $teammate->id,
            'title' => 'Teammate workload task',
        ]);

        $response = $this->get('/dashboard');

        $response->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->has('workload')
                ->where('workload.0.name', $teammate->name)
                ->where('workload.0.tasks', 1)
            );
    }

    public function test_team_page_returns_successful_response(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $teamMember = User::factory()->create();
        Project::factory()->create([
            'owner_id' => $teamMember->id,
        ]);

        $project = Project::factory()->create([
            'owner_id' => $user->id,
        ]);

        Task::factory()->create([
            'project_id' => $project->id,
            'assignee_id' => $teamMember->id,
        ]);

        $response = $this->get('/team');

        $response->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Team/Index')
                ->has('team')
                ->where('team.0.name', $teamMember->name)
                ->where('team.0.projects', 1)
                ->where('team.0.tasks', 1)
            );
    }

    public function test_projects_page_returns_successful_response(): void
    {
        $this->actingAs(User::factory()->create());

        $response = $this->get('/projects');

        $response->assertStatus(200);
    }

    public function test_tasks_page_can_filter_by_assignee(): void
    {
        $currentUser = User::factory()->create();
        $assignee = User::factory()->create();
        $this->actingAs($currentUser);

        $project = Project::factory()->create([
            'owner_id' => $currentUser->id,
        ]);

        Task::factory()->create([
            'project_id' => $project->id,
            'assignee_id' => $assignee->id,
            'title' => 'Assigned task',
        ]);

        Task::factory()->create([
            'project_id' => $project->id,
            'assignee_id' => $currentUser->id,
            'title' => 'Current user task',
        ]);

        $response = $this->get('/tasks?assignee_id=' . $assignee->id);

        $response->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Tasks/Index')
                ->has('tasks', 1)
                ->where('tasks.0.title', 'Assigned task')
                ->where('tasks.0.assignee', $assignee->name)
            );
    }

    public function test_projects_page_can_filter_by_owner(): void
    {
        $currentUser = User::factory()->create();
        $otherOwner = User::factory()->create();
        $this->actingAs($currentUser);

        Project::factory()->create([
            'owner_id' => $currentUser->id,
            'name' => 'Current user project',
        ]);

        Project::factory()->create([
            'owner_id' => $otherOwner->id,
            'name' => 'Other user project',
        ]);

        $response = $this->get('/projects?owner_id=' . $otherOwner->id);

        $response->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Projects/Index')
                ->has('projects', 1)
                ->where('projects.0.name', 'Other user project')
                ->where('projects.0.owner', $otherOwner->name)
            );
    }

    public function test_project_detail_page_returns_successful_response(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $project = Project::factory()->create([
            'owner_id' => $user->id,
        ]);

        $response = $this->get('/projects/' . $project->id);

        $response->assertStatus(200);
    }

    public function test_task_detail_page_returns_successful_response(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $project = Project::factory()->create([
            'owner_id' => $user->id,
        ]);

        $task = Task::factory()->create([
            'project_id' => $project->id,
            'assignee_id' => $user->id,
        ]);

        $response = $this->get('/tasks/' . $task->id);

        $response->assertStatus(200);
    }

    public function test_user_can_create_a_project(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post('/projects', [
            'name' => 'Customer portal refresh',
            'status' => 'planning',
            'summary' => 'Improve onboarding and customer account workflows.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('projects', [
            'name' => 'Customer portal refresh',
            'owner_id' => $user->id,
            'status' => 'planning',
        ]);
    }

    public function test_user_can_assign_a_project_to_another_owner(): void
    {
        $owner = User::factory()->create();
        $newOwner = User::factory()->create();
        $this->actingAs($owner);

        $response = $this->post('/projects', [
            'name' => 'Finance automation sync',
            'status' => 'in progress',
            'summary' => 'Align all finance operations workflows.',
            'owner_id' => $newOwner->id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('projects', [
            'name' => 'Finance automation sync',
            'owner_id' => $newOwner->id,
            'status' => 'in progress',
        ]);
    }

    public function test_user_can_create_a_task_for_a_project(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $project = Project::factory()->create([
            'owner_id' => $user->id,
        ]);

        $response = $this->post('/projects/' . $project->id . '/tasks', [
            'title' => 'Finalize onboarding checklist',
            'status' => 'todo',
            'priority' => 'high',
            'description' => 'Align the checklist with the updated account flow.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tasks', [
            'project_id' => $project->id,
            'title' => 'Finalize onboarding checklist',
            'status' => 'todo',
            'priority' => 'high',
        ]);
    }

    public function test_user_can_assign_a_task_to_another_team_member(): void
    {
        $owner = User::factory()->create();
        $assignee = User::factory()->create();
        $this->actingAs($owner);

        $project = Project::factory()->create([
            'owner_id' => $owner->id,
        ]);

        $response = $this->post('/projects/' . $project->id . '/tasks', [
            'title' => 'QA final review',
            'status' => 'in progress',
            'priority' => 'medium',
            'description' => 'Check the final release notes before sign-off.',
            'assignee_id' => $assignee->id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tasks', [
            'project_id' => $project->id,
            'title' => 'QA final review',
            'assignee_id' => $assignee->id,
        ]);
    }

    public function test_user_can_update_an_existing_project(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $project = Project::factory()->create([
            'owner_id' => $user->id,
            'name' => 'Original project name',
            'status' => 'planning',
            'summary' => 'Old summary',
        ]);

        $response = $this->put('/projects/' . $project->id, [
            'name' => 'Updated project name',
            'status' => 'in progress',
            'summary' => 'New summary for the refreshed plan.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Updated project name',
            'status' => 'in progress',
            'summary' => 'New summary for the refreshed plan.',
        ]);
    }

    public function test_user_can_update_an_existing_task(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $project = Project::factory()->create([
            'owner_id' => $user->id,
        ]);

        $task = Task::factory()->create([
            'project_id' => $project->id,
            'assignee_id' => $user->id,
            'title' => 'Old task title',
            'status' => 'todo',
            'priority' => 'medium',
            'description' => 'Old description',
        ]);

        $response = $this->put('/tasks/' . $task->id, [
            'title' => 'Updated task title',
            'status' => 'in progress',
            'priority' => 'high',
            'description' => 'Updated description for the active sprint.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Updated task title',
            'status' => 'in progress',
            'priority' => 'high',
            'description' => 'Updated description for the active sprint.',
        ]);
    }

    public function test_user_can_delete_a_project(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $project = Project::factory()->create([
            'owner_id' => $user->id,
            'name' => 'Project to delete',
        ]);

        $response = $this->delete('/projects/' . $project->id);

        $response->assertRedirect();
        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
        ]);
    }

    public function test_user_can_delete_a_task(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $project = Project::factory()->create([
            'owner_id' => $user->id,
        ]);

        $task = Task::factory()->create([
            'project_id' => $project->id,
            'assignee_id' => $user->id,
            'title' => 'Task to delete',
        ]);

        $response = $this->delete('/tasks/' . $task->id);

        $response->assertRedirect();
        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
        ]);
    }
}
