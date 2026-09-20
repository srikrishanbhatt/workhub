<?php

use App\Http\Controllers\ProfileController;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = auth()->user();

    $projects = Project::query()
        ->where('owner_id', $user->id)
        ->with('tasks')
        ->latest('updated_at')
        ->get();

    $openTasks = Task::query()
        ->where('assignee_id', $user->id)
        ->whereIn('status', ['todo', 'in progress'])
        ->count();

    $priorityTasks = Task::query()
        ->where('assignee_id', $user->id)
        ->with('project')
        ->latest('updated_at')
        ->limit(3)
        ->get()
        ->map(fn (Task $task) => [
            'title' => $task->title,
            'due' => $task->status === 'todo' ? 'Due today' : 'Due soon',
            'owner' => $task->assignee?->name ?? 'Unassigned',
        ])
        ->all();

    $stats = [
        [
            'label' => 'Active Projects',
            'value' => (string) $projects->count(),
            'tone' => 'bg-blue-50 text-blue-700',
        ],
        [
            'label' => 'Open Tasks',
            'value' => (string) $openTasks,
            'tone' => 'bg-purple-50 text-purple-700',
        ],
        [
            'label' => 'Team Members',
            'value' => (string) User::query()->count(),
            'tone' => 'bg-emerald-50 text-emerald-700',
        ],
        [
            'label' => 'Completion',
            'value' => $projects->count() > 0
                ? (string) round((Task::query()->where('assignee_id', $user->id)->where('status', 'review')->count() / max(1, Task::query()->where('assignee_id', $user->id)->count())) * 100) . '%'
                : '0%',
            'tone' => 'bg-amber-50 text-amber-700',
        ],
    ];

    $workload = User::query()
        ->select('id', 'name')
        ->withCount('assignedTasks')
        ->orderByDesc('assigned_tasks_count')
        ->orderBy('name')
        ->get()
        ->map(fn (User $member) => [
            'id' => $member->id,
            'name' => $member->name,
            'tasks' => (int) $member->assigned_tasks_count,
        ])
        ->all();

    return Inertia::render('Dashboard', [
        'stats' => $stats,
        'priorities' => $priorityTasks,
        'workload' => $workload,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/team', function () {
    $team = User::query()
        ->whereKeyNot(auth()->id())
        ->select('id', 'name')
        ->withCount(['ownedProjects', 'assignedTasks'])
        ->orderBy('name')
        ->get()
        ->map(fn (User $user) => [
            'id' => $user->id,
            'name' => $user->name,
            'projects' => $user->owned_projects_count,
            'tasks' => $user->assigned_tasks_count,
        ])->all();

    return Inertia::render('Team/Index', [
        'team' => $team,
    ]);
})->middleware(['auth', 'verified'])->name('team.index');

Route::get('/projects', function () {
    $query = Project::query()->with('owner');

    if (request()->filled('owner_id')) {
        $query->where('owner_id', request('owner_id'));
    }

    return Inertia::render('Projects/Index', [
        'projects' => $query
            ->latest('updated_at')
            ->get()
            ->map(fn (Project $project) => [
                'id' => $project->id,
                'name' => $project->name,
                'owner' => $project->owner?->name ?? 'Unassigned',
                'status' => match ($project->status) {
                    'planning' => 'Planning',
                    'in progress' => 'In progress',
                    'review' => 'Review',
                    default => ucfirst((string) $project->status),
                },
                'updated_at' => $project->updated_at?->diffForHumans() ?? 'Just now',
            ])->all(),
        'users' => User::query()
            ->select('id', 'name')
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
            ])->all(),
        'selectedOwnerId' => request('owner_id'),
    ]);
})->middleware(['auth', 'verified'])->name('projects.index');

Route::get('/projects/create', function () {
    return Inertia::render('Projects/Create', [
        'users' => User::query()
            ->select('id', 'name')
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
            ])->all(),
        'defaultOwnerId' => auth()->id(),
    ]);
})->middleware(['auth', 'verified'])->name('projects.create');

Route::get('/projects/{project}/edit', function (Project $project) {
    return Inertia::render('Projects/Edit', [
        'project' => [
            'id' => $project->id,
            'name' => $project->name,
            'status' => $project->status,
            'summary' => $project->summary ?? '',
            'owner_id' => $project->owner_id,
        ],
        'users' => User::query()
            ->select('id', 'name')
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
            ])->all(),
    ]);
})->middleware(['auth', 'verified'])->name('projects.edit');

Route::post('/projects', function () {
    $validated = request()->validate([
        'name' => ['required', 'string', 'max:255'],
        'status' => ['required', 'string', 'in:planning,in progress,review'],
        'summary' => ['nullable', 'string'],
        'owner_id' => ['nullable', 'exists:users,id'],
    ]);

    $project = Project::create([
        'owner_id' => $validated['owner_id'] ?? auth()->id(),
        'name' => $validated['name'],
        'status' => $validated['status'],
        'summary' => $validated['summary'] ?? null,
    ]);

    return to_route('projects.show', $project);
})->middleware(['auth', 'verified'])->name('projects.store');

Route::put('/projects/{project}', function (Project $project) {
    $validated = request()->validate([
        'name' => ['required', 'string', 'max:255'],
        'status' => ['required', 'string', 'in:planning,in progress,review'],
        'summary' => ['nullable', 'string'],
        'owner_id' => ['nullable', 'exists:users,id'],
    ]);

    $project->update([
        'owner_id' => $validated['owner_id'] ?? $project->owner_id,
        'name' => $validated['name'],
        'status' => $validated['status'],
        'summary' => $validated['summary'] ?? null,
    ]);

    return to_route('projects.show', $project);
})->middleware(['auth', 'verified'])->name('projects.update');

Route::delete('/projects/{project}', function (Project $project) {
    $project->tasks()->delete();
    $project->delete();

    return to_route('projects.index');
})->middleware(['auth', 'verified'])->name('projects.destroy');

Route::get('/projects/{project}', function (Project $project) {
    $project->load('owner', 'tasks.assignee');

    return Inertia::render('Projects/Show', [
        'project' => [
            'id' => $project->id,
            'name' => $project->name,
            'owner' => $project->owner?->name ?? 'Unassigned',
            'status' => match ($project->status) {
                'planning' => 'Planning',
                'in progress' => 'In progress',
                'review' => 'Review',
                default => ucfirst((string) $project->status),
            },
            'summary' => $project->summary ?? 'No project summary yet.',
            'tasks' => $project->tasks->map(fn (\App\Models\Task $task) => [
                'id' => $task->id,
                'title' => $task->title,
                'status' => match ($task->status) {
                    'todo' => 'Todo',
                    'in progress' => 'In progress',
                    'review' => 'Review',
                    default => ucfirst((string) $task->status),
                },
                'priority' => match ($task->priority) {
                    'low' => 'Low',
                    'medium' => 'Medium',
                    'high' => 'High',
                    default => ucfirst((string) $task->priority),
                },
            ])->all(),
        ],
    ]);
})->middleware(['auth', 'verified'])->name('projects.show');

Route::get('/tasks', function () {
    $query = Task::query()->with(['project', 'assignee']);

    if (request()->filled('assignee_id')) {
        $query->where('assignee_id', request('assignee_id'));
    }

    return Inertia::render('Tasks/Index', [
        'tasks' => $query
            ->latest('updated_at')
            ->get()
            ->map(fn (Task $task) => [
                'id' => $task->id,
                'title' => $task->title,
                'project' => $task->project?->name ?? 'Unknown project',
                'assignee' => $task->assignee?->name ?? 'Unassigned',
                'status' => match ($task->status) {
                    'todo' => 'Todo',
                    'in progress' => 'In progress',
                    'review' => 'Review',
                    default => ucfirst((string) $task->status),
                },
                'priority' => match ($task->priority) {
                    'low' => 'Low',
                    'medium' => 'Medium',
                    'high' => 'High',
                    default => ucfirst((string) $task->priority),
                },
                'updated_at' => $task->updated_at?->diffForHumans() ?? 'Just now',
            ])->all(),
        'users' => User::query()
            ->select('id', 'name')
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
            ])->all(),
        'selectedAssigneeId' => request('assignee_id'),
    ]);
})->middleware(['auth', 'verified'])->name('tasks.index');

Route::get('/projects/{project}/tasks/create', function (Project $project) {
    return Inertia::render('Tasks/Create', [
        'project' => [
            'id' => $project->id,
            'name' => $project->name,
        ],
        'users' => User::query()
            ->select('id', 'name')
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
            ])->all(),
        'defaultAssigneeId' => auth()->id(),
    ]);
})->middleware(['auth', 'verified'])->name('tasks.create');

Route::get('/tasks/{task}/edit', function (Task $task) {
    return Inertia::render('Tasks/Edit', [
        'task' => [
            'id' => $task->id,
            'project_id' => $task->project_id,
            'title' => $task->title,
            'status' => $task->status,
            'priority' => $task->priority,
            'description' => $task->description ?? '',
            'assignee_id' => $task->assignee_id,
        ],
        'users' => User::query()
            ->select('id', 'name')
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
            ])->all(),
    ]);
})->middleware(['auth', 'verified'])->name('tasks.edit');

Route::post('/projects/{project}/tasks', function (Project $project) {
    $validated = request()->validate([
        'title' => ['required', 'string', 'max:255'],
        'status' => ['required', 'string', 'in:todo,in progress,review'],
        'priority' => ['required', 'string', 'in:low,medium,high'],
        'description' => ['nullable', 'string'],
        'assignee_id' => ['nullable', 'exists:users,id'],
    ]);

    $task = $project->tasks()->create([
        'assignee_id' => $validated['assignee_id'] ?? auth()->id(),
        'title' => $validated['title'],
        'status' => $validated['status'],
        'priority' => $validated['priority'],
        'description' => $validated['description'] ?? null,
    ]);

    return to_route('tasks.show', $task);
})->middleware(['auth', 'verified'])->name('tasks.store');

Route::put('/tasks/{task}', function (Task $task) {
    $validated = request()->validate([
        'title' => ['required', 'string', 'max:255'],
        'status' => ['required', 'string', 'in:todo,in progress,review'],
        'priority' => ['required', 'string', 'in:low,medium,high'],
        'description' => ['nullable', 'string'],
        'assignee_id' => ['nullable', 'exists:users,id'],
    ]);

    $task->update([
        'assignee_id' => $validated['assignee_id'] ?? $task->assignee_id,
        'title' => $validated['title'],
        'status' => $validated['status'],
        'priority' => $validated['priority'],
        'description' => $validated['description'] ?? null,
    ]);

    return to_route('tasks.show', $task);
})->middleware(['auth', 'verified'])->name('tasks.update');

Route::delete('/tasks/{task}', function (Task $task) {
    $projectId = $task->project_id;
    $task->delete();

    return to_route('projects.show', $projectId);
})->middleware(['auth', 'verified'])->name('tasks.destroy');

Route::get('/tasks/{task}', function (Task $task) {
    $task->load('project', 'assignee');

    return Inertia::render('Tasks/Show', [
        'task' => [
            'id' => $task->id,
            'title' => $task->title,
            'project' => $task->project?->name ?? 'Unknown project',
            'project_id' => $task->project_id,
            'status' => match ($task->status) {
                'todo' => 'Todo',
                'in progress' => 'In progress',
                'review' => 'Review',
                default => ucfirst((string) $task->status),
            },
            'priority' => match ($task->priority) {
                'low' => 'Low',
                'medium' => 'Medium',
                'high' => 'High',
                default => ucfirst((string) $task->priority),
            },
            'assignee' => $task->assignee?->name ?? 'Unassigned',
            'description' => $task->description ?? 'No task description yet.',
        ],
    ]);
})->middleware(['auth', 'verified'])->name('tasks.show');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
