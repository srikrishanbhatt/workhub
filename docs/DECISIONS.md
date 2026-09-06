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

## Pending decisions

- Local development database
- Authentication starter kit and flow
- Exact initial schema and relationship details

These will be decided in Phase 0 before implementation begins.
