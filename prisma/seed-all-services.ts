import { createClient } from '@libsql/client'
import 'dotenv/config'

const client = createClient({ url: process.env.DATABASE_URL!, authToken: process.env.DATABASE_AUTH_TOKEN })
function rid() { return Math.random().toString(36).slice(2, 22) }

const P = {
    portfolio:          'cmnmy4vov000104jp95cp0y95',
    aiContentFabric:    'cmnmy4vcq000004jps1z8pk3v',
    botsellerSaas:      'cmlxcv4jn000004jpsnb7pn4w',
    botsellerTg:        'cml7d5vbt000604l2sxfyg27a',
    brieftube:          'cmlc4uxpp000004kzuqbpfngg',
    faithly:            'cml3dx6rw000004l22f1j3dxk',
    falapa:             'cmnv3z5x5000104l167p6tsbj',
    darshan:            'cmmtu3xw8000004l7hk4hhkgv',
    obsidian:           'cmnmykki8000e04jpeq2a37i2',
}

type S = { projectId: string; name: string; category: string; url: string; account: string; notes: string }

const SERVICES: S[] = [

    // ────────────────────────────────────────────────────
    // Architect Portfolio (nzt108.dev)
    // ────────────────────────────────────────────────────
    { projectId: P.portfolio, name: 'Turso',             category: 'database',   url: 'https://app.turso.tech',                                  account: 'nzt108',     notes: 'LibSQL cloud, free tier' },
    { projectId: P.portfolio, name: 'Vercel',            category: 'frontend',   url: 'https://vercel.com/nzt108-dev',                           account: 'nzt108',     notes: 'Auto-deploy from main, nzt108.dev' },
    { projectId: P.portfolio, name: 'Cookie Auth',       category: 'auth',       url: '',                                                        account: '',           notes: 'Custom admin auth via HttpOnly cookie' },
    { projectId: P.portfolio, name: 'Microsoft Clarity', category: 'analytics',  url: 'https://clarity.microsoft.com',                           account: 'nzt108',     notes: 'Session recordings + heatmaps' },
    { projectId: P.portfolio, name: 'Sentry',            category: 'monitoring', url: 'https://sentry.io',                                       account: 'nzt108',     notes: 'Configure SENTRY_AUTH_TOKEN + SENTRY_ORG_SLUG' },
    { projectId: P.portfolio, name: 'GitHub',            category: 'cicd',       url: 'https://github.com/nzt108-dev/architect-portfolio',        account: 'nzt108-dev', notes: '' },

    // ────────────────────────────────────────────────────
    // AI Content Fabric
    // ────────────────────────────────────────────────────
    { projectId: P.aiContentFabric, name: 'VPS',              category: 'backend',    url: '',                                  account: 'nzt108',     notes: 'Docker-контейнер с Python сервисами' },
    { projectId: P.aiContentFabric, name: 'OpenRouter',       category: 'ai_llm',     url: 'https://openrouter.ai',             account: 'nzt108',     notes: 'GPT-4o для генерации текста' },
    { projectId: P.aiContentFabric, name: 'ElevenLabs',       category: 'ai_llm',     url: 'https://elevenlabs.io',             account: 'nzt108',     notes: 'Text-to-Speech, мультиязычная озвучка' },
    { projectId: P.aiContentFabric, name: 'OpenAI Whisper',   category: 'ai_llm',     url: 'https://openai.com',                account: 'nzt108',     notes: 'Speech-to-text транскрипция' },
    { projectId: P.aiContentFabric, name: 'Telegram Bot API', category: 'messaging',  url: 'https://t.me/BotFather',            account: 'nzt108',     notes: 'Основной интерфейс бота (aiogram)' },
    { projectId: P.aiContentFabric, name: 'YouTube (yt-dlp)', category: 'ext_api',    url: 'https://youtube.com',               account: '',           notes: 'Скачивание видео через yt-dlp' },
    { projectId: P.aiContentFabric, name: 'GitHub',           category: 'cicd',       url: 'https://github.com/nzt108-dev',     account: 'nzt108-dev', notes: '' },

    // ────────────────────────────────────────────────────
    // BotSeller SaaS (Python/FastAPI/Celery — основной)
    // ────────────────────────────────────────────────────
    { projectId: P.botsellerSaas, name: 'PostgreSQL',       category: 'database',   url: '',                                  account: 'nzt108',     notes: 'Docker — PostgreSQL 16-alpine' },
    { projectId: P.botsellerSaas, name: 'Redis',            category: 'database',   url: '',                                  account: 'nzt108',     notes: 'Docker — очередь задач для Celery' },
    { projectId: P.botsellerSaas, name: 'VPS + Docker',     category: 'backend',    url: '',                                  account: 'nzt108',     notes: 'FastAPI + Celery workers + bot процессы' },
    { projectId: P.botsellerSaas, name: 'Vercel',           category: 'frontend',   url: 'https://vercel.com',               account: 'nzt108',     notes: 'Next.js admin дашборд' },
    { projectId: P.botsellerSaas, name: 'Telegram Bot API', category: 'messaging',  url: 'https://t.me/BotFather',           account: 'nzt108',     notes: 'Основная платформа SaaS ботов' },
    { projectId: P.botsellerSaas, name: 'Stripe',           category: 'payments',   url: 'https://dashboard.stripe.com',     account: 'nzt108',     notes: 'Подписки для клиентов SaaS' },
    { projectId: P.botsellerSaas, name: 'Sentry',           category: 'monitoring', url: 'https://sentry.io',                account: 'nzt108',     notes: 'Error tracking (Next.js frontend)' },
    { projectId: P.botsellerSaas, name: 'GitHub',           category: 'cicd',       url: 'https://github.com/nzt108-dev',    account: 'nzt108-dev', notes: '' },

    // ────────────────────────────────────────────────────
    // BotSeller TG (маленький, standalone)
    // ────────────────────────────────────────────────────
    { projectId: P.botsellerTg, name: 'PostgreSQL',       category: 'database',   url: '',                               account: 'nzt108',     notes: 'Основная БД бота' },
    { projectId: P.botsellerTg, name: 'VPS',             category: 'backend',    url: '',                               account: 'nzt108',     notes: 'Python процесс бота' },
    { projectId: P.botsellerTg, name: 'Telegram Bot API', category: 'messaging',  url: 'https://t.me/BotFather',        account: 'nzt108',     notes: 'Основной интерфейс' },
    { projectId: P.botsellerTg, name: 'GitHub',           category: 'cicd',       url: 'https://github.com/nzt108-dev', account: 'nzt108-dev', notes: '' },

    // ────────────────────────────────────────────────────
    // BriefTube AI (Flutter + FastAPI)
    // ────────────────────────────────────────────────────
    { projectId: P.brieftube, name: 'Supabase',         category: 'database',   url: 'https://supabase.com/dashboard',          account: 'nzt108',     notes: 'PostgreSQL + Auth + RLS' },
    { projectId: P.brieftube, name: 'App Store',        category: 'frontend',   url: 'https://appstoreconnect.apple.com',       account: 'nzt108',     notes: 'Flutter iOS' },
    { projectId: P.brieftube, name: 'Google Play',      category: 'frontend',   url: 'https://play.google.com/console',         account: 'nzt108',     notes: 'Flutter Android' },
    { projectId: P.brieftube, name: 'VPS + Docker',     category: 'backend',    url: '',                                        account: 'nzt108',     notes: 'FastAPI backend + APScheduler' },
    { projectId: P.brieftube, name: 'Supabase Auth',    category: 'auth',       url: 'https://supabase.com/dashboard',          account: 'nzt108',     notes: 'Email + Google + Apple Sign-In' },
    { projectId: P.brieftube, name: 'Supabase Storage', category: 'storage',    url: 'https://supabase.com/dashboard',          account: 'nzt108',     notes: 'Медиафайлы' },
    { projectId: P.brieftube, name: 'OpenRouter',       category: 'ai_llm',     url: 'https://openrouter.ai',                   account: 'nzt108',     notes: 'Gemini 2.0 Flash — суммаризация' },
    { projectId: P.brieftube, name: 'Firebase Messaging', category: 'messaging', url: 'https://console.firebase.google.com',    account: 'nzt108',     notes: 'FCM — push-уведомления' },
    { projectId: P.brieftube, name: 'YouTube Data API', category: 'ext_api',    url: 'https://console.cloud.google.com',        account: 'nzt108',     notes: 'Данные каналов + транскрипции' },
    { projectId: P.brieftube, name: 'Sentry',           category: 'monitoring', url: 'https://sentry.io',                       account: 'nzt108',     notes: 'Error tracking' },
    { projectId: P.brieftube, name: 'GitHub',           category: 'cicd',       url: 'https://github.com/nzt108-dev',           account: 'nzt108-dev', notes: '' },

    // ────────────────────────────────────────────────────
    // Faithly (Flutter мобильное приложение)
    // ────────────────────────────────────────────────────
    { projectId: P.faithly, name: 'Firestore',          category: 'database',   url: 'https://console.firebase.google.com',     account: 'nzt108',     notes: 'NoSQL основная БД' },
    { projectId: P.faithly, name: 'App Store',          category: 'frontend',   url: 'https://appstoreconnect.apple.com',       account: 'nzt108',     notes: 'Flutter iOS' },
    { projectId: P.faithly, name: 'Google Play',        category: 'frontend',   url: 'https://play.google.com/console',         account: 'nzt108',     notes: 'Flutter Android' },
    { projectId: P.faithly, name: 'Firebase Auth',      category: 'auth',       url: 'https://console.firebase.google.com',     account: 'nzt108',     notes: 'Email + Google + Apple Sign-In' },
    { projectId: P.faithly, name: 'Firebase Storage',   category: 'storage',    url: 'https://console.firebase.google.com',     account: 'nzt108',     notes: 'Медиафайлы пользователей' },
    { projectId: P.faithly, name: 'Gemini',             category: 'ai_llm',     url: 'https://aistudio.google.com',             account: 'nzt108',     notes: 'Google Generative AI — AI-функции' },
    { projectId: P.faithly, name: 'Firebase Messaging', category: 'messaging',  url: 'https://console.firebase.google.com',     account: 'nzt108',     notes: 'FCM — push-уведомления' },
    { projectId: P.faithly, name: 'GitHub',             category: 'cicd',       url: 'https://github.com/nzt108-dev',           account: 'nzt108-dev', notes: '' },

    // ────────────────────────────────────────────────────
    // Falapa / Fast Lending SaaS
    // ────────────────────────────────────────────────────
    { projectId: P.falapa, name: 'Neon',              category: 'database',   url: 'https://console.neon.tech',               account: 'nzt108',     notes: 'Serverless PostgreSQL (production)' },
    { projectId: P.falapa, name: 'Upstash Redis',     category: 'database',   url: 'https://console.upstash.com',             account: 'nzt108',     notes: 'Serverless Redis — ARQ task queue + cache' },
    { projectId: P.falapa, name: 'Cloudflare Pages',  category: 'frontend',   url: 'https://dash.cloudflare.com',             account: 'nzt108',     notes: 'Фронтенд + DNS + CDN' },
    { projectId: P.falapa, name: 'VPS + Docker',      category: 'backend',    url: '',                                        account: 'nzt108',     notes: 'FastAPI + ARQ workers + APScheduler' },
    { projectId: P.falapa, name: 'OpenRouter',        category: 'ai_llm',     url: 'https://openrouter.ai',                   account: 'nzt108',     notes: 'Gemini 2.0 Flash — анализ + генерация' },
    { projectId: P.falapa, name: 'Google Generative AI', category: 'ai_llm',  url: 'https://aistudio.google.com',             account: 'nzt108',     notes: 'Voice AI для звонков' },
    { projectId: P.falapa, name: 'Twilio',            category: 'messaging',  url: 'https://console.twilio.com',              account: 'nzt108',     notes: 'Voice calls + SMS OTP' },
    { projectId: P.falapa, name: 'Stripe',            category: 'payments',   url: 'https://dashboard.stripe.com',            account: 'nzt108',     notes: 'Подписки + оплата' },
    { projectId: P.falapa, name: 'Resend',            category: 'email',      url: 'https://resend.com',                      account: 'nzt108',     notes: 'Транзакционные письма' },
    { projectId: P.falapa, name: 'Apify',             category: 'ext_api',    url: 'https://console.apify.com',               account: 'nzt108',     notes: 'Google Maps scraping' },
    { projectId: P.falapa, name: 'Name.com',          category: 'ext_api',    url: 'https://www.name.com',                    account: 'nzt108',     notes: 'Домены + WHOIS scraping' },
    { projectId: P.falapa, name: 'GitHub',            category: 'cicd',       url: 'https://github.com/nzt108-dev',           account: 'nzt108-dev', notes: '' },

    // ────────────────────────────────────────────────────
    // Darshan
    // ────────────────────────────────────────────────────
    { projectId: P.darshan, name: 'Turso',    category: 'database',   url: 'https://app.turso.tech',                   account: 'nzt108',     notes: 'LibSQL cloud (Drizzle ORM)' },
    { projectId: P.darshan, name: 'Vercel',   category: 'frontend',   url: 'https://vercel.com',                       account: 'nzt108',     notes: 'Next.js 16 + React 19' },
    { projectId: P.darshan, name: 'Clerk',    category: 'auth',       url: 'https://dashboard.clerk.com',              account: 'nzt108',     notes: 'Auth + user management' },
    { projectId: P.darshan, name: 'GitHub',   category: 'cicd',       url: 'https://github.com/nzt108-dev',            account: 'nzt108-dev', notes: '' },

    // ────────────────────────────────────────────────────
    // Obsidian Second Mind (локальный MCP сервер)
    // ────────────────────────────────────────────────────
    { projectId: P.obsidian, name: 'ChromaDB',         category: 'database',   url: '',                               account: '',           notes: 'Локальная векторная БД (semantic search)' },
    { projectId: P.obsidian, name: 'Local (no deploy)', category: 'backend',   url: '',                               account: '',           notes: 'CLI / MCP server, 100% локально' },
    { projectId: P.obsidian, name: 'Telegram Bot API', category: 'messaging',  url: 'https://t.me/BotFather',         account: 'nzt108',     notes: 'Опциональный ввод заметок через Telegram' },
]

async function seed() {
    const projectIds = [...new Set(SERVICES.map(s => s.projectId))]

    // Не трогаем SpotBench (уже заполнен отдельно)
    for (const pid of projectIds) {
        await client.execute({ sql: `DELETE FROM "ProjectService" WHERE "projectId" = ?`, args: [pid] })
    }
    console.log(`🗑  Cleared ${projectIds.length} projects\n`)

    let ok = 0
    for (const s of SERVICES) {
        await client.execute({
            sql: `INSERT INTO "ProjectService" ("id","projectId","name","category","url","account","notes","createdAt") VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`,
            args: [rid(), s.projectId, s.name, s.category, s.url, s.account, s.notes],
        })
        console.log(`  ✅ ${s.category.padEnd(11)} | ${s.name}`)
        ok++
    }
    console.log(`\n✅ Done — ${ok} services across ${projectIds.length} projects`)
}
seed().catch(console.error)
