---
description: How to update project cards on nzt108.dev portfolio site
---

# Portfolio Project Update Skill

This skill allows you to create or update project cards on the nzt108.dev portfolio website.

## API Endpoint

```
POST https://nzt108.dev/api/agent/projects
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

The API key is stored in environment variable `PORTFOLIO_API_KEY`.

## How to Use

### 1. Gather Project Information

Before making the API call, collect the following information from the current project:

#### Required Fields
- **title**: Project name (e.g., "Christian Social Network")

#### Optional Fields (agent should auto-detect)
- **slug**: URL-friendly name (auto-generated from title if not provided)
- **description**: 1-2 sentence summary (public only, no implementation details)
- **category**: One of `mobile`, `telegram`, or `web`
- **progress**: 0-100 percentage
- **technologies**: Array of technology names
- **githubUrl**: GitHub repository URL
- **demoUrl**: Live demo URL
- **featured**: Boolean, show on homepage
- **roadmapItems**: Array of { title, status } where status is `done`, `in-progress`, or `planned`

### 2. How to Determine Progress Automatically

1. Look for `task.md` or `TODO.md` in the project root
2. Count completed tasks `[x]` vs total tasks `[ ]` and `[x]`
3. Calculate: `(completed / total) * 100`
4. Round to nearest 5%

Alternative methods:
- If project has milestones, calculate based on completed milestones
- If no task tracking exists, estimate based on:
  - 10-20%: Initial setup, basic structure
  - 30-50%: Core features in development
  - 60-80%: Most features done, testing/polish
  - 90-100%: Production ready

### 3. How to Detect Technologies

Check these files in order:

| File | Extract From |
|------|--------------|
| `package.json` | `dependencies` and `devDependencies` keys |
| `pubspec.yaml` | `dependencies` section |
| `go.mod` | `require` block |
| `requirements.txt` | Package names |
| `Cargo.toml` | `[dependencies]` section |
| `build.gradle` | `dependencies` block |

**Rules:**
- Include only main technologies (max 6-8)
- Prioritize: Framework > Language > Database > Tools
- Use proper capitalization: "Next.js", "Flutter", "PostgreSQL"
- Skip dev-only tools unless relevant (e.g., skip eslint, prettier)

### 4. How to Create Roadmap Items

1. Check `task.md` for high-level items
2. Or check GitHub Issues/Milestones
3. Or use project README sections

**Guidelines:**
- Keep items high-level (e.g., "User Authentication" not "Implement JWT token refresh")
- Maximum 6-8 items
- Status mapping:
  - `done`: Completed features
  - `in-progress`: Currently being worked on
  - `planned`: Future features

⚠️ **SECURITY**: Never include:
- Implementation details
- API keys or secrets
- Internal architecture specifics
- Security measures details

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

### 6. Response Format

**Success (create):**
```json
{
  "success": true,
  "action": "created",
  "project": { "id": "...", "title": "...", "slug": "...", "progress": 45 }
}
```

**Success (update):**
```json
{
  "success": true,
  "action": "updated",
  "project": { "id": "...", "title": "...", "slug": "...", "progress": 45 }
}
```

**Error:**
```json
{
  "error": "Error message"
}
```

## Additional API Operations

### List All Projects
```bash
curl -X GET https://nzt108.dev/api/agent/projects \
  -H "Authorization: Bearer $PORTFOLIO_API_KEY"
```

### Delete a Project
```bash
curl -X DELETE "https://nzt108.dev/api/agent/projects?slug=project-slug" \
  -H "Authorization: Bearer $PORTFOLIO_API_KEY"
```

## Example Workflow

When user says: "Update my portfolio with this project"

1. Read project files to understand what it is
2. Detect category from project type (Flutter → mobile, Bot → telegram, etc.)
3. Extract technologies from dependency files
4. Calculate progress from task tracking
5. Generate brief, public-safe description
6. Create roadmap from high-level tasks
7. Make API call to update portfolio
8. Confirm success to user

## Environment Variable

The API key should be available as `PORTFOLIO_API_KEY` in your environment.
If not set, ask the user to provide it or check the Vercel environment variables.
