import { createClient } from '@libsql/client'
import 'dotenv/config'

const client = createClient({ url: process.env.DATABASE_URL!, authToken: process.env.DATABASE_AUTH_TOKEN })
const PROJECT_ID = 'cmoe5egw8000004l7iltr27u5'

function rid() { return Math.random().toString(36).slice(2, 22) }

const SERVICES = [
    // Database
    { name: 'Supabase',             category: 'database',   url: 'https://supabase.com/dashboard',                     account: 'nzt108',     notes: 'PostgreSQL + RLS' },

    // Frontend / Hosting
    { name: 'Vercel',               category: 'frontend',   url: 'https://vercel.com/nzt108-dev',                      account: 'nzt108',     notes: 'Hosting, CDN, Firewall, Cron jobs' },

    // Auth
    { name: 'Supabase Auth',        category: 'auth',       url: 'https://supabase.com/dashboard',                     account: 'nzt108',     notes: 'Email/password + Google OAuth' },
    { name: 'Google OAuth',         category: 'auth',       url: 'https://console.cloud.google.com',                   account: 'nzt108',     notes: 'OAuth credentials for Google sign-in' },

    // Storage
    { name: 'Supabase Storage',     category: 'storage',    url: 'https://supabase.com/dashboard',                     account: 'nzt108',     notes: 'Work photos, profile images' },

    // AI / LLM
    { name: 'OpenRouter',           category: 'ai_llm',     url: 'https://openrouter.ai',                              account: 'nzt108',     notes: 'AI compose сообщений — liquid/lfm-2.5-1.2b-instruct:free' },

    // Payments
    { name: 'Stripe',               category: 'payments',   url: 'https://dashboard.stripe.com',                       account: 'nzt108',     notes: 'Pro подписки + webhooks' },

    // Email
    { name: 'Resend',               category: 'email',      url: 'https://resend.com',                                 account: 'nzt108',     notes: 'Транзакционные письма' },
    { name: 'BIMI',                 category: 'email',      url: 'https://bimigroup.org',                              account: 'nzt108',     notes: 'Логотип в письмах (sender branding)' },

    // Analytics
    { name: 'PostHog',              category: 'analytics',  url: 'https://app.posthog.com',                            account: 'nzt108',     notes: 'Product analytics' },
    { name: 'Google Analytics 4',   category: 'analytics',  url: 'https://analytics.google.com',                       account: 'nzt108',     notes: 'Трафик. GA ID: G-5Q9B0JMS1M' },
    { name: 'Meta Pixel',           category: 'analytics',  url: 'https://business.facebook.com/events_manager',       account: 'nzt108',     notes: 'Реклама. Pixel ID: 1610919666882004' },

    // Monitoring
    { name: 'Sentry',               category: 'monitoring', url: 'https://sentry.io',                                  account: 'nzt108',     notes: 'Error tracking' },

    // CI/CD
    { name: 'GitHub',               category: 'cicd',       url: 'https://github.com/nzt108-dev/crewup',               account: 'nzt108-dev', notes: 'Репозиторий (slug: crewup)' },
    { name: 'Turbo Remote Cache',   category: 'cicd',       url: 'https://turbo.build/repo/docs/core-concepts/remote-caching', account: 'nzt108', notes: 'Кэш билдов' },

    // External APIs
    { name: 'CSLB',                 category: 'ext_api',    url: 'https://www2.cslb.ca.gov',                           account: '',           notes: 'HTML scraping — верификация строительных лицензий CA' },

    // Other / Legal
    { name: 'DMCA Agent',           category: 'other',      url: 'https://dmca.copyright.gov',                         account: '',           notes: '№ DMCA-1071903' },
]

async function seed() {
    await client.execute({ sql: `DELETE FROM "ProjectService" WHERE "projectId" = ?`, args: [PROJECT_ID] })
    console.log('🗑  Cleared SpotBench services\n')

    for (const s of SERVICES) {
        await client.execute({
            sql: `INSERT INTO "ProjectService" ("id","projectId","name","category","url","account","notes","createdAt") VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`,
            args: [rid(), PROJECT_ID, s.name, s.category, s.url, s.account, s.notes],
        })
        console.log(`  ✅ ${s.category.padEnd(11)} | ${s.name}`)
    }
    console.log(`\n✅ Done — ${SERVICES.length} services`)
}
seed().catch(console.error)
