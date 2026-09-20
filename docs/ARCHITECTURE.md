# WorkHub Architecture

## Current state

WorkHub is a conventional Laravel web application. No product-specific application features have been built yet.

## Starting approach

- **Framework:** Laravel 13
- **Interface:** Server-rendered Blade views
- **Application style:** Laravel's conventional routes, controllers, Eloquent models, migrations, and Form Requests as the project grows
- **Database:** To be selected during Phase 0; MySQL is the proposed local-development choice
- **Authentication:** Laravel Breeze with Blade, introduced in Phase 2

## Initial domain model (not implemented)

The initial entities we expect to design are:

- User
- Organization (workspace)
- Organization membership (`organization_user` pivot table)
- Project
- Task

### Planned relationships

- A user belongs to many organizations through `organization_user`.
- An organization belongs to many users through `organization_user`.
- Each membership row will contain a `role`. Roles will be designed in the Authorization phase.
- An organization belongs to one owner user.
- An organization will have many projects, and each project will belong to exactly one organization.
- A project will have many tasks, and each task will belong to one project.
- A task may be assigned to one user; assignment is optional.

### Planned organization fields

- `id`
- `name`
- `owner_id`
- Laravel timestamps

Organizations will not have a description initially. We can add one later if a real product requirement calls for it.

### Planned organization membership fields

- `organization_id`
- `user_id`
- `role`
- Laravel timestamps

The `organization_id` and `user_id` combination will be unique, so a user can only hold one membership in the same organization.

### Planned project fields

- `id`
- `organization_id`
- `name`
- Laravel timestamps

Projects will not have a description initially. Project status and other workflow details will be introduced only when a feature needs them.

### Planned task fields

- `id`
- `project_id`
- `title`
- `description` (optional)
- `assigned_to_user_id` (optional)
- `status`
- `priority`
- `due_date` (optional)
- Laravel timestamps

Allowed status and priority values will be designed in the Tasks phase. Comments, attachments, activity history, and notifications are deliberately outside the initial task model.

These are design decisions only. We will create migrations and Eloquent relationships in their respective learning phases.

## Authentication plan

WorkHub will use Laravel Breeze with Blade for authentication. We will introduce it in Phase 2, not during project planning. The initial interface will use Blade server-rendered views.

## Boundaries

We will use Laravel's built-in capabilities first. Services, events, queues, policies, APIs, and real-time features will be introduced only when a real WorkHub requirement makes them useful.
