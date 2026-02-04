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

#### Optional Fields
- **slug**: URL-friendly name (auto-generated if not provided)
- **description**: 1-2 sentence VAGUE summary
- **category**: `mobile`, `telegram`, or `web`
- **progress**: 0-100 percentage
- **technologies**: Array of PUBLIC technology names only
- **githubUrl**: Only if repository is PUBLIC
- **demoUrl**: Only LIVE public URLs (no staging/dev)
- **roadmapItems**: HIGH-LEVEL tasks only

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

### 5. Make the API Request

```bash
curl -X POST https://nzt108.dev/api/agent/projects \
  -H "Authorization: Bearer $PORTFOLIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Project Name",
    "description": "Brief public description",
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
