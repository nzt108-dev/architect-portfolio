import { createClient } from '@libsql/client'
import 'dotenv/config'

const client = createClient({ url: process.env.DATABASE_URL!, authToken: process.env.DATABASE_AUTH_TOKEN })
const PROJECT_ID = 'cmoe5egw8000004l7iltr27u5'

function rid() { return Math.random().toString(36).slice(2, 22) }

const SERVICES = [
    { name: 'Supabase',       category: 'database',   url: 'https://supabase.com/dashboard',        account: 'nzt108',     notes: 'PostgreSQL + RLS + Storage' },
    { name: 'Vercel',         category: 'frontend',   url: 'https://vercel.com/nzt108-dev',          account: 'nzt108',     notes: 'Auto-deploy from main, getspotbench.com' },
    { name: 'Supabase Auth',  category: 'auth',       url: 'https://supabase.com/dashboard',        account: 'nzt108',     notes: 'Google OAuth + email/password' },
    { name: 'Supabase Storage', category: 'storage',  url: 'https://supabase.com/dashboard',        account: 'nzt108',     notes: 'Work photos, profile images' },
    { name: 'Stripe',         category: 'payments',   url: 'https://dashboard.stripe.com',          account: 'nzt108',     notes: 'Pro subscriptions + featured placement' },
    { name: 'Resend',         category: 'email',      url: 'https://resend.com',                    account: 'nzt108',     notes: 'Transactional emails' },
    { name: 'PostHog',        category: 'analytics',  url: 'https://app.posthog.com',               account: 'nzt108',     notes: 'Product analytics' },
    { name: 'GitHub',         category: 'cicd',       url: 'https://github.com/nzt108-dev/crewup',  account: 'nzt108-dev', notes: 'Repo slug: crewup (old name)' },
]

async function seed() {
    await client.execute({ sql: `DELETE FROM "ProjectService" WHERE "projectId" = ?`, args: [PROJECT_ID] })
    console.log('🗑  Cleared existing SpotBench services\n')

    for (const s of SERVICES) {
        await client.execute({
            sql: `INSERT INTO "ProjectService" ("id","projectId","name","category","url","account","notes","createdAt") VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`,
            args: [rid(), PROJECT_ID, s.name, s.category, s.url, s.account, s.notes],
        })
        console.log(`  ✅ ${s.category.padEnd(10)} | ${s.name}`)
    }
    console.log('\n✅ Done!')
}
seed().catch(console.error)
