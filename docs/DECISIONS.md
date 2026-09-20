# WorkHub Architecture Decisions

## 2026-09-05 — Start with a conventional Laravel web application

**Decision:** Use Laravel 13 with server-rendered Blade views as the initial application style.

**Why:** It exposes Laravel's routing, controllers, requests, responses, middleware, and Blade concepts directly without adding a separate frontend application.

**Consequences:** We can later add an API or real-time client when those phases require them, without making them a prerequisite for learning the framework fundamentals.

## 2026-09-06 — Model organization membership with a pivot table

**Decision:** Users and organizations will have a many-to-many relationship through an `organization_user` membership (pivot) table. Each membership will include a `role` field.

**Why:** A user can collaborate in multiple organizations, and each organization can contain multiple users. The membership record is the natural place for organization-specific information such as a member's role.

**Consequences:** Organization membership and role authorization will be introduced together when we reach the Organizations and Authorization phases. No migrations are created during Phase 0.

## 2026-09-06 — Scope each project to one organization

**Decision:** Every project belongs to exactly one organization.

**Why:** Projects need a clear workspace boundary for organization membership and future authorization rules.

**Consequences:** An organization can have many projects; a project cannot be shared across organizations.

## 2026-09-06 — Scope each task to one project

**Decision:** Every task belongs to exactly one project. A task can be unassigned or assigned to one user who belongs to the project's organization.

**Why:** A task needs a clear project context, while allowing an unassigned task supports planning work before a teammate is chosen.

**Consequences:** The future task schema will include a required project reference and an optional assignee reference. We will enforce organization membership when we learn authorization.

## 2026-09-06 — Give each organization one owner

**Decision:** Every organization belongs to exactly one owner user.

**Why:** An owner establishes clear initial responsibility for a workspace and provides a dependable starting point for future administration rules.

**Consequences:** Organization creation will record an owner. Ownership transfer and additional administrative roles will be introduced later with authorization.

## 2026-09-06 — Keep organizations minimal initially

**Decision:** An organization will initially have a required `name`, an owner reference, and Laravel timestamps. It will not have a description.

**Why:** The initial Organizations phase should focus on migrations and relationships rather than fields that do not yet serve a feature.

**Consequences:** A description can be added later through a new migration if a real use case requires it.

## 2026-09-06 — Keep timestamps on organization memberships

**Decision:** The `organization_user` membership record will include Laravel timestamps, and each user–organization pair will be unique.

**Why:** Timestamps show when a member joined, and uniqueness prevents duplicate memberships.

**Consequences:** Future invitations and activity history can build on a membership's creation time without changing the original design.

## 2026-09-06 — Keep projects minimal initially

**Decision:** A project will initially have a required name, an organization reference, and Laravel timestamps. It will not have a description or status yet.

**Why:** This is the smallest useful project model and keeps future CRUD and validation lessons focused.

**Consequences:** Project workflow details can be added later through new migrations when they support a real feature.

## 2026-09-06 — Plan the core task fields

**Decision:** A task will belong to a project and have a required title. It may have a description, an assignee, and a due date. It will also have status and priority fields.

**Why:** These fields support basic work tracking without prematurely implementing collaboration or notification features.

**Consequences:** We will decide the permitted status and priority values when we implement the Tasks phase. The task schema will not initially include comments, attachments, or activity history.

## 2026-09-06 — Use Laravel Breeze with Blade for authentication

**Decision:** WorkHub will use Laravel Breeze with Blade for its initial authentication flow. We will introduce it in Phase 2.

**Why:** Breeze follows Laravel conventions for registration, login, password reset, and email verification. Blade keeps the initial interface server-rendered, making Laravel's core request and response concepts easier to learn directly.

**Consequences:** We will not install authentication packages during Phase 0 or Phase 1. A separate JavaScript frontend is not part of the initial application architecture.

## Pending decisions

- Local development database
- Authentication starter kit and flow
- Exact initial schema and relationship details

These will be decided in Phase 0 before implementation begins.
