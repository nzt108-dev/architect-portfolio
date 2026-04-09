# Mission Control — Расширение админки

Мне нужно расширить админку на nzt108.dev до полноценного **Mission Control** — центра управления для CEO. У нас уже есть рабочая админка с Dashboard, Workspaces, CRM, Leads, Finance, Analytics, Blog. Нужно добавить новые возможности и улучшить существующие.

## Задача 1: AI Agent Hub (новая секция в admin)

Создай новую страницу `/admin/agent-hub` — это место где AI-агенты предлагают улучшения для проектов, а я approve/reject их одним кликом.

### Что нужно:

1. **Модель данных** — добавь в `prisma/schema.prisma`:

```prisma
model AgentSuggestion {
  id          String   @id @default(cuid())
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  type        String   // "optimization" | "feature" | "bug" | "security" | "refactor"
  title       String
  description String   // Markdown описание
  impact      String   @default("medium") // "low" | "medium" | "high" | "critical"
  effort      String   @default("medium") // "trivial" | "small" | "medium" | "large"
  status      String   @default("pending") // "pending" | "approved" | "rejected" | "implemented"
  aiModel     String   @default("") // Какая модель предложила
  reasoning   String   @default("") // Почему агент это предлагает
  codeSnippet String   @default("") // Пример кода (если есть)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  reviewedAt  DateTime?
}
```

Не забудь добавить relation `agentSuggestions AgentSuggestion[]` в модель `Project`.

2. **API routes**:
   - `POST /api/agent/suggestions` — агент создаёт предложение (авторизация по Bearer token, как у activity)
   - `GET /api/admin/agent-hub` — получить все предложения (с фильтрами)
   - `PATCH /api/admin/agent-hub/[id]` — approve/reject/implemented

3. **Страница `/admin/agent-hub/page.tsx`**:
   - Вкладки: Pending | Approved | Rejected | All
   - Каждое предложение — карточка с:
     - Тип (иконка), название, проект
     - Impact badge (цветной)
     - Effort badge
     - Описание (markdown)
     - Code snippet (если есть) в code block
     - Кнопки: ✅ Approve | ❌ Reject | 🚀 Mark Implemented
   - Статистика сверху: Pending / Approved today / Implementation rate
   - Фильтр по проекту и по типу

4. **Добавь в sidebar** в layout.tsx:
   - Секция "AI" между Business и Site
   - `🤖 Agent Hub` — ссылка на `/admin/agent-hub`

5. **Стиль** — используй тот же cyber/dark стиль что и в остальной админке (var(--neon-cyan), var(--bg-card) и т.д.)


## Задача 2: PWA (Progressive Web App)

Сделай сайт устанавливаемым как приложение на iPhone:

1. **Создай `/public/manifest.json`**:
```json
{
  "name": "nzt108 Mission Control",
  "short_name": "Mission Control",
  "description": "CEO Dashboard & Project Management",
  "start_url": "/admin",
  "display": "standalone",
  "background_color": "#0a0e17",
  "theme_color": "#22d3ee",
  "orientation": "any",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

2. **Сгенерируй иконки** для PWA — минималистичный логотип "◈" на тёмном фоне (#0a0e17), неоново-голубой (#22d3ee). Создай `/public/icons/icon-192.png` и `/public/icons/icon-512.png`.

3. **Добавь meta-теги** в `app/layout.tsx`:
```html
<link rel="manifest" href="/manifest.json" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="theme-color" content="#0a0e17" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
```

4. **Service Worker** — базовый, для offline-shell:
```js
// public/sw.js
const CACHE_NAME = 'mc-v1'
const SHELL = ['/admin', '/manifest.json']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(SHELL)))
})

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  )
})
```

5. **Регистрация SW** — в layout.tsx добавь скрипт регистрации service worker.


## Задача 3: Mobile Layout (адаптивность)

Сейчас sidebar 264px — на мобильном не работает. Сделай:

1. **На десктопе** (≥768px) — оставь sidebar как есть
2. **На мобильном** (<768px):
   - Убери sidebar
   - Добавь **bottom navigation bar** (фиксированный снизу):
     - 📊 Dashboard
     - 🖥️ Workspaces
     - 🤖 Agent Hub
     - 🔥 Leads
     - ⚙️ More (открывает sheet с остальными пунктами)
   - Стиль: blur backdrop, тёмный, с accent цветами для активного пункта
   - Высота: 64px + safe-area-inset-bottom (для iPhone с notch)

3. **Hamburger menu** на мобильном — полноэкранный overlay с тем же списком что в sidebar


## Задача 4: Project Detail View

В Workspaces при клике на карточку проекта — открывай детальный вид `/admin/workspaces/[slug]`:

1. **Header**: название, статус, стек, ссылки (deploy, github, backend)
2. **Tabs**:
   - **Overview**: progress, roadmap items, recent activity
   - **Tasks**: CRM задачи этого проекта (kanban или список)
   - **Agent**: Предложения агентов только для этого проекта
   - **Activity**: полный лог активности
3. **API**: `GET /api/admin/workspaces/[slug]` — вернуть всю инфу по проекту

---

## Общие требования

- Не ломай существующий функционал
- Все новые API routes за той же авторизацией (Bearer token для agent, cookie для admin)
- Используй существующие CSS переменные и стиль из globals.css
- Русский язык для UI где уже используется русский, английский где английский
- После реализации — запусти `npx prisma db push` для миграции
- Протестируй все страницы — убедись что ничего не сломалось
