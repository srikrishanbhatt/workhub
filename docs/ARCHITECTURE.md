# WorkHub Architecture

## Current state

WorkHub is a conventional Laravel web application. No product-specific application features have been built yet.

## Starting approach

- **Framework:** Laravel 13
- **Interface:** Server-rendered Blade views
- **Application style:** Laravel's conventional routes, controllers, Eloquent models, migrations, and Form Requests as the project grows
- **Database:** To be selected during Phase 0; MySQL is the proposed local-development choice
- **Authentication:** To be selected during Phase 0; Laravel Breeze with Blade is the leading candidate when we begin the Users phase

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

These are design decisions only. We will create migrations and Eloquent relationships in their respective learning phases.

## Boundaries

We will use Laravel's built-in capabilities first. Services, events, queues, policies, APIs, and real-time features will be introduced only when a real WorkHub requirement makes them useful.
