---
description: How to update project cards on nzt108.dev portfolio site
---

# Portfolio Project Update Skill

This skill allows you to create or update project cards on the nzt108.dev portfolio website.

## ⚠️ SECURITY RULES (READ FIRST!)

### ❌ NEVER Include:
- **Implementation details** (architecture, algorithms, data structures)
- **API endpoints** or route names
- **Database schema** or table names
- **Environment variables** or config values
- **Security measures** (auth flow, encryption methods)
- **Third-party service names** (specific payment providers, etc.)
- **Internal URLs** or staging/dev links
- **Code snippets** or technical specifics
- **Business logic** details

### ✅ ONLY Include:
- **Generic feature names**: "User Authentication" not "JWT with refresh tokens"
- **High-level status**: "Chat System" not "WebSocket real-time messaging with Redis pub/sub"
- **Public technologies**: "Flutter", "Next.js" (from public repos or obvious from app)
- **Public links only**: GitHub (if public), App Store, Play Store, live demo
- **Vague descriptions**: "Mobile app for community" not "Social network with encrypted messaging"

### Examples of SAFE vs UNSAFE:

| ❌ UNSAFE | ✅ SAFE |
|-----------|---------|
| "Implement OAuth2 + PKCE flow" | "User Authentication" |
| "PostgreSQL with Row Level Security" | "Database Integration" |
| "Stripe + Apple Pay integration" | "Payment System" |
| "Redis caching for session management" | "Performance Optimization" |
| "WebSocket real-time sync" | "Real-time Features" |
| "GraphQL API with subscriptions" | "API Layer" |

---

## API Endpoint

```
POST https://nzt108.dev/api/agent/projects
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

The API key is stored in environment variable `PORTFOLIO_API_KEY`.

## How to Use

### 1. Gather Project Information (SAFELY)

#### Required Fields
- **title**: Project name (public name only)

#### Optional Fields — Basic
- **slug**: URL-friendly name (auto-generated if not provided)
- **description**: 1-2 sentence VAGUE summary
- **category**: `mobile`, `telegram`, or `web`
- **progress**: 0-100 percentage
- **technologies**: Array of PUBLIC technology names only
- **githubUrl**: Only if repository is PUBLIC
- **demoUrl**: Only LIVE public URLs (no staging/dev)
- **featured**: Boolean, show on homepage

#### Optional Fields — Case Study (IMPORTANT!)
- **longDescription**: 3-5 paragraph detailed description of the project — what it does, the problem it solves, and why it matters. Write it as a narrative, not bullet points. This is the main body of the project page.
- **ideaText**: 1-3 paragraphs explaining the idea behind the project — what problem does it solve, what inspired it, what gap in the market it fills.
- **clientBenefit**: 1-3 paragraphs explaining what value the project delivers — what does the user/client get, what results were achieved, what makes it special.
- **screenshots**: Array of public image URLs (e.g. hosted on Imgur, Cloudinary, or the project's own domain). These will be displayed as a gallery on the project detail page. Use direct image links (ending in .png, .jpg, etc.)

#### Optional Fields — Roadmap
- **roadmapItems**: Array of `{ title, status }` where status is `done`, `in-progress`, or `planned`. HIGH-LEVEL tasks only.

### 2. How to Determine Progress

1. Look for `task.md` in project root
2. Count completed `[x]` vs total tasks
3. Calculate: `(completed / total) * 100`
4. Round to nearest 5%

### 3. How to Detect Technologies (PUBLIC ONLY)

Check dependency files but only include:
- Main framework (Flutter, Next.js, React, etc.)
- Primary language (TypeScript, Dart, Python, Go)
- Public cloud services (Firebase, AWS - generic)
- Database type (PostgreSQL, MongoDB - just the name)

**Skip internal/sensitive:**
- Payment providers
- Auth services
- Monitoring tools
- CI/CD specifics

### 4. How to Create Roadmap Items

**RULE: If in doubt, make it MORE vague, not less.**

Good examples:
- "Core Features" ✅
- "User Profiles" ✅
- "Messaging" ✅
- "Admin Panel" ✅
- "Analytics" ✅
- "Notifications" ✅

Bad examples:
- "Implement E2E encryption" ❌
- "Add Stripe webhook handlers" ❌
- "Setup Redis cluster" ❌
- "Deploy to K8s" ❌

### 5. How to Write Case Study Content

**longDescription** — Write it like a product landing page:
- What is this project?
- What problem does it solve?
- Who is the target audience?
- What makes it unique?

**ideaText** — Write it like a founder's story:
- What inspired the project?
- What pain point did you notice?
- Why does this matter?

**clientBenefit** — Write it like a sales pitch:
- What tangible value does the user get?
- What metrics improved?
- What's the ROI?

### 6. Make the API Request

```bash
curl -X POST https://nzt108.dev/api/agent/projects \
  -H "Authorization: Bearer $PORTFOLIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Project Name",
    "description": "Brief public description",
    "longDescription": "Detailed 3-5 paragraph case study description...",
    "ideaText": "What inspired this project and what problem does it solve...",
    "clientBenefit": "What value does this deliver to users/clients...",
    "screenshots": [
      "https://example.com/screenshot1.png",
      "https://example.com/screenshot2.png"
    ],
    "category": "web",
    "progress": 45,
    "technologies": ["Next.js", "TypeScript", "PostgreSQL"],
    "githubUrl": "https://github.com/nzt108-dev/project",
    "demoUrl": "https://project.demo",
    "roadmapItems": [
      { "title": "Core Features", "status": "done" },
      { "title": "User Dashboard", "status": "in-progress" },
      { "title": "Analytics", "status": "planned" }
    ]
  }'
```

---

## How to Add This Skill to a New Project

When user creates a new project, copy this skill:

```bash
mkdir -p /path/to/new-project/.agent/skills/update-portfolio
cp /path/to/architect-portfolio/.agent/skills/update-portfolio/SKILL.md \
   /path/to/new-project/.agent/skills/update-portfolio/
```

Or user can say: "Add the portfolio update skill to this project"

---

## Response Format

**Success:**
```json
{
  "success": true,
  "action": "created" | "updated",
  "project": { "id": "...", "title": "...", "slug": "...", "progress": 45 }
}
```

## Additional Operations

### List Projects
```bash
curl -X GET https://nzt108.dev/api/agent/projects \
  -H "Authorization: Bearer $PORTFOLIO_API_KEY"
```

### Delete Project
```bash
curl -X DELETE "https://nzt108.dev/api/agent/projects?slug=project-slug" \
  -H "Authorization: Bearer $PORTFOLIO_API_KEY"
```

---

## Activity Logging (IMPORTANT!)

**After every git push or completed task, log the activity** so the owner can track progress across all projects.

### Log a Push
```bash
curl -X POST https://nzt108.dev/api/agent/activity \
  -H "Authorization: Bearer $PORTFOLIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "projectSlug": "project-slug",
    "type": "push",
    "title": "feat: add payment integration",
    "details": "Added subscription billing and invoice generation"
  }'
```

### Log a Completed Task
```bash
curl -X POST https://nzt108.dev/api/agent/activity \
  -H "Authorization: Bearer $PORTFOLIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "projectSlug": "project-slug",
    "type": "task",
    "title": "Completed user authentication flow"
  }'
```

### Log a Deploy
```bash
curl -X POST https://nzt108.dev/api/agent/activity \
  -H "Authorization: Bearer $PORTFOLIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "projectSlug": "project-slug",
    "type": "deploy",
    "title": "Deployed v1.2 to production"
  }'
```

### Activity Types
| Type | When to use |
|------|-------------|
| `push` | After a `git push` |
| `task` | When a significant task/feature is completed |
| `deploy` | After deployment to production |
| `milestone` | When a major milestone is reached |
| `note` | General notes or observations |

### Fields
- **projectSlug** (required): The slug of the project
- **type** (required): One of: `push`, `task`, `deploy`, `milestone`, `note`
- **title** (required): Short summary (use git commit message for pushes)
- **details** (optional): Additional context

### When to Log
1. After every `git push` — use the commit message as the title
2. After completing a significant feature — use "Completed: [feature name]"
3. After deployment — use "Deployed [version/description]"
4. When you reach a milestone — use "Milestone: [description]"

---

## CRM Task Management (IMPORTANT!)

**After every git push, completed task, or milestone — update the CRM board** so the owner can track tasks visually in a kanban view.

### Create a Task
```bash
curl -X POST https://nzt108.dev/api/agent/crm \
  -H "Authorization: Bearer $PORTFOLIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "projectSlug": "project-slug",
    "title": "Implement user auth",
    "description": "Add login/register flow",
    "type": "task",
    "status": "todo",
    "priority": "high",
    "dueDate": "2026-03-01"
  }'
```

### Update a Task Status
```bash
curl -X POST https://nzt108.dev/api/agent/crm \
  -H "Authorization: Bearer $PORTFOLIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "projectSlug": "project-slug",
    "taskId": "existing-task-id",
    "status": "done"
  }'
```

### List Project Tasks
```bash
curl -X GET "https://nzt108.dev/api/agent/crm?projectSlug=project-slug" \
  -H "Authorization: Bearer $PORTFOLIO_API_KEY"
```

### Task Types
| Type | When to use |
|------|-------------|
| `task` | Regular work items |
| `milestone` | Major project milestones (MVP, launch, etc.) |
| `bug` | Bug fixes |
| `feature` | New feature implementations |

### Task Statuses (Kanban columns)
| Status | Meaning |
|--------|---------|
| `backlog` | Not yet planned |
| `todo` | Planned for soon |
| `in-progress` | Currently being worked on |
| `review` | Needs review or testing |
| `done` | Completed |

### Priority Levels
`low`, `medium`, `high`, `urgent`

### Fields
- **projectSlug** (required): The slug of the project
- **title** (required for new tasks): Task title
- **description** (optional): Details about the task
- **type** (optional): `task`, `milestone`, `bug`, `feature` — default: `task`
- **status** (optional): `backlog`, `todo`, `in-progress`, `review`, `done` — default: `backlog`
- **priority** (optional): `low`, `medium`, `high`, `urgent` — default: `medium`
- **dueDate** (optional): ISO date string
- **taskId** (optional): If provided, updates existing task instead of creating new

---

## Complete Workflow: What to Do After Every Push

> **IMPORTANT**: Every time you push to GitHub, do ALL THREE steps:

1. **Log activity** — `POST /api/agent/activity` with commit message
2. **Update portfolio card** — `POST /api/agent/projects` with updated progress & roadmap
3. **Update CRM tasks** — `POST /api/agent/crm` — mark completed tasks as `done`, create new tasks for next steps, update milestones
