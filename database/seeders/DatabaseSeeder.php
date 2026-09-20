<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $projects = Project::factory(3)->create([
            'owner_id' => $user->id,
        ]);

        foreach ($projects as $project) {
            Task::factory(rand(2, 4))->create([
                'project_id' => $project->id,
                'assignee_id' => $user->id,
            ]);
        }
    }
}
