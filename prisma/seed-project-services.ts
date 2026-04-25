import { createClient } from '@libsql/client'
import 'dotenv/config'

const client = createClient({ url: process.env.DATABASE_URL!, authToken: process.env.DATABASE_AUTH_TOKEN })

function id() {
    return Math.random().toString(36).slice(2, 22)
}

// ── Project IDs from DB ──
const PROJECTS: Record<string, string> = {
    'architect-portfolio': 'cmnmy4vov000104jp95cp0y95',
    'brieftube-ai':        'cmlc4uxpp000004kzuqbpfngg',
    'faithly':             'cml3dx6rw000004l22f1j3dxk',  // Facely = Faithly
    'falapa':              'cmnv3z5x5000104l167p6tsbj',
    'botseller-tg':        'cml7d5vbt000604l2sxfyg27a',
    'botseller-saas':      'cmlxcv4jn000004jpsnb7pn4w',
}

interface ServiceEntry {
    projectId: string
    name: string
    category: string
    url: string
    account: string
    notes: string
}

const SERVICES: ServiceEntry[] = [

    // ── Architect Portfolio (nzt108.dev) ──
    { projectId: PROJECTS['architect-portfolio'], name: 'Turso',              category: 'database',   url: 'https://app.turso.tech',                  account: 'nzt108',  notes: 'LibSQL cloud, free tier' },
    { projectId: PROJECTS['architect-portfolio'], name: 'Vercel',             category: 'frontend',   url: 'https://vercel.com/nzt108-dev',            account: 'nzt108',  notes: 'Auto-deploy from main branch' },
    { projectId: PROJECTS['architect-portfolio'], name: 'GitHub',             category: 'cicd',       url: 'https://github.com/nzt108-dev/architect-portfolio', account: 'nzt108-dev', notes: 'Main repo' },
    { projectId: PROJECTS['architect-portfolio'], name: 'Microsoft Clarity',  category: 'analytics',  url: 'https://clarity.microsoft.com',            account: 'nzt108',  notes: 'Session recordings + heatmaps' },
    { projectId: PROJECTS['architect-portfolio'], name: 'Sentry',             category: 'monitoring', url: 'https://sentry.io',                        account: 'nzt108',  notes: 'Configure SENTRY_AUTH_TOKEN' },
    { projectId: PROJECTS['architect-portfolio'], name: 'NextAuth',           category: 'auth',       url: '',                                         account: '',        notes: 'Cookie-based admin auth' },

    // ── BriefTube AI ──
    { projectId: PROJECTS['brieftube-ai'], name: 'Firebase',         category: 'database',   url: 'https://console.firebase.google.com',       account: 'nzt108',  notes: 'Firestore + Auth' },
    { projectId: PROJECTS['brieftube-ai'], name: 'Firebase Auth',    category: 'auth',       url: 'https://console.firebase.google.com',       account: 'nzt108',  notes: '' },
    { projectId: PROJECTS['brieftube-ai'], name: 'Firebase Storage', category: 'storage',    url: 'https://console.firebase.google.com',       account: 'nzt108',  notes: '' },
    { projectId: PROJECTS['brieftube-ai'], name: 'App Store',        category: 'frontend',   url: 'https://appstoreconnect.apple.com',         account: 'nzt108',  notes: 'Flutter iOS app' },
    { projectId: PROJECTS['brieftube-ai'], name: 'Google Play',      category: 'frontend',   url: 'https://play.google.com/console',           account: 'nzt108',  notes: 'Flutter Android app' },
    { projectId: PROJECTS['brieftube-ai'], name: 'Railway',          category: 'backend',    url: 'https://railway.app',                      account: 'nzt108',  notes: 'FastAPI backend' },
    { projectId: PROJECTS['brieftube-ai'], name: 'YouTube Data API', category: 'ai_llm',     url: 'https://console.cloud.google.com',          account: 'nzt108',  notes: 'Video parsing & transcription' },
    { projectId: PROJECTS['brieftube-ai'], name: 'OpenRouter',       category: 'ai_llm',     url: 'https://openrouter.ai',                    account: 'nzt108',  notes: 'LLM summaries' },

    // ── Faithly (Facely) ──
    { projectId: PROJECTS['faithly'], name: 'Firestore',        category: 'database',   url: 'https://console.firebase.google.com',       account: 'nzt108',  notes: 'Main DB' },
    { projectId: PROJECTS['faithly'], name: 'Firebase Auth',    category: 'auth',       url: 'https://console.firebase.google.com',       account: 'nzt108',  notes: 'Email + Google sign-in' },
    { projectId: PROJECTS['faithly'], name: 'Firebase Storage', category: 'storage',    url: 'https://console.firebase.google.com',       account: 'nzt108',  notes: 'User media files' },
    { projectId: PROJECTS['faithly'], name: 'App Store',        category: 'frontend',   url: 'https://appstoreconnect.apple.com',         account: 'nzt108',  notes: 'Flutter iOS' },
    { projectId: PROJECTS['faithly'], name: 'Google Play',      category: 'frontend',   url: 'https://play.google.com/console',           account: 'nzt108',  notes: 'Flutter Android' },
    { projectId: PROJECTS['faithly'], name: 'FCM',              category: 'messaging',  url: 'https://console.firebase.google.com',       account: 'nzt108',  notes: 'Push notifications' },

    // ── Falapa (Fast Lending SaaS) ──
    { projectId: PROJECTS['falapa'], name: 'PostgreSQL',   category: 'database',   url: '',                                          account: '',        notes: 'Main DB' },
    { projectId: PROJECTS['falapa'], name: 'Railway',      category: 'backend',    url: 'https://railway.app',                      account: 'nzt108',  notes: 'FastAPI backend' },
    { projectId: PROJECTS['falapa'], name: 'Vercel',       category: 'frontend',   url: 'https://vercel.com',                       account: 'nzt108',  notes: 'Frontend deploy' },
    { projectId: PROJECTS['falapa'], name: 'Gemini',       category: 'ai_llm',     url: 'https://aistudio.google.com',              account: 'nzt108',  notes: 'AI scoring & analysis' },
    { projectId: PROJECTS['falapa'], name: 'Twilio',       category: 'messaging',  url: 'https://console.twilio.com',               account: 'nzt108',  notes: 'SMS OTP & notifications' },
    { projectId: PROJECTS['falapa'], name: 'GitHub',       category: 'cicd',       url: 'https://github.com/nzt108-dev',            account: 'nzt108-dev', notes: '' },

    // ── BotSeller TG ──
    { projectId: PROJECTS['botseller-tg'], name: 'PostgreSQL',       category: 'database',   url: '',                                      account: '',        notes: '' },
    { projectId: PROJECTS['botseller-tg'], name: 'VPS',              category: 'backend',    url: '',                                      account: 'nzt108',  notes: 'Python bot server' },
    { projectId: PROJECTS['botseller-tg'], name: 'Telegram Bot API', category: 'messaging',  url: 'https://t.me/BotFather',               account: 'nzt108',  notes: 'Main bot interface' },
    { projectId: PROJECTS['botseller-tg'], name: 'GitHub',           category: 'cicd',       url: 'https://github.com/nzt108-dev',        account: 'nzt108-dev', notes: '' },

    // ── BotSeller SaaS ──
    { projectId: PROJECTS['botseller-saas'], name: 'Supabase',         category: 'database',   url: 'https://supabase.com/dashboard',       account: 'nzt108',  notes: 'DB + Auth + Storage' },
    { projectId: PROJECTS['botseller-saas'], name: 'Supabase Auth',    category: 'auth',       url: 'https://supabase.com/dashboard',       account: 'nzt108',  notes: '' },
    { projectId: PROJECTS['botseller-saas'], name: 'Vercel',           category: 'frontend',   url: 'https://vercel.com',                   account: 'nzt108',  notes: 'Next.js frontend' },
    { projectId: PROJECTS['botseller-saas'], name: 'Railway',          category: 'backend',    url: 'https://railway.app',                  account: 'nzt108',  notes: 'Bot worker processes' },
    { projectId: PROJECTS['botseller-saas'], name: 'Telegram Bot API', category: 'messaging',  url: 'https://t.me/BotFather',               account: 'nzt108',  notes: 'Bot platform' },
    { projectId: PROJECTS['botseller-saas'], name: 'Stripe',           category: 'payments',   url: 'https://dashboard.stripe.com',         account: 'nzt108',  notes: 'Subscription payments' },
    { projectId: PROJECTS['botseller-saas'], name: 'GitHub',           category: 'cicd',       url: 'https://github.com/nzt108-dev',        account: 'nzt108-dev', notes: '' },
]

async function seed() {
    console.log('🌱 Seeding project services...\n')

    // Clear existing services for these projects to avoid duplicates
    const projectIds = [...new Set(SERVICES.map(s => s.projectId))]
    for (const pid of projectIds) {
        await client.execute({ sql: `DELETE FROM "ProjectService" WHERE "projectId" = ?`, args: [pid] })
    }
    console.log(`🗑  Cleared existing services for ${projectIds.length} projects\n`)

    let ok = 0, fail = 0
    for (const s of SERVICES) {
        const serviceId = id()
        try {
            await client.execute({
                sql: `INSERT INTO "ProjectService" ("id","projectId","name","category","url","account","notes","createdAt")
                      VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`,
                args: [serviceId, s.projectId, s.name, s.category, s.url, s.account, s.notes],
            })
            console.log(`  ✅ ${s.projectId.slice(-8)} | ${s.category.padEnd(10)} | ${s.name}`)
            ok++
        } catch (err) {
            console.error(`  ❌ ${s.name}:`, err instanceof Error ? err.message : err)
            fail++
        }
    }

    console.log(`\n✅ Done — ${ok} inserted, ${fail} failed`)
}

seed().catch(console.error)
