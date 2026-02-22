import { createClient } from '@libsql/client'
import 'dotenv/config'

const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
})

const BASE = '/Users/nzt108/.gemini/antigravity/scratch'

const projectPaths: Record<string, string> = {
    'portfolio': `${BASE}/architect-portfolio`,
    'astro-psiholog': `${BASE}/Astro-psiholog`,
    'botseller-saas': `${BASE}/botseller_saas`,
    'botseller-tg': `${BASE}/botseller_tg`,
    'content-fabric-saas': `${BASE}/content-fabric-saas`,
    'dance-studio-website': `${BASE}/dance-studio-website`,
    'faithly': `${BASE}/Faithly`,
    'brieftube-ai': `${BASE}/youtube-parser`,
    'norcal-deal-engine': `${BASE}/norcal_deals`,
    'zillow-parser': `${BASE}/zillow-parser`,
}

async function migrate() {
    console.log('🚀 Adding localPath column + populating project paths...\n')

    // 1. Add column
    try {
        await client.execute(`ALTER TABLE "Project" ADD COLUMN "localPath" TEXT NOT NULL DEFAULT ''`)
        console.log('✅ Added localPath column')
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        if (msg.includes('duplicate column') || msg.includes('already exists')) {
            console.log('⏭️  localPath column already exists')
        } else {
            console.error('❌', msg)
        }
    }

    // 2. Populate paths
    for (const [slug, path] of Object.entries(projectPaths)) {
        try {
            const result = await client.execute({
                sql: `UPDATE "Project" SET "localPath" = ? WHERE "slug" = ?`,
                args: [path, slug],
            })
            if (result.rowsAffected > 0) {
                console.log(`✅ ${slug} → ${path}`)
            } else {
                console.log(`⚠️  ${slug} — not found in DB (skipped)`)
            }
        } catch (err: unknown) {
            console.error(`❌ ${slug}:`, err instanceof Error ? err.message : String(err))
        }
    }

    console.log('\n✅ Done!')
}

migrate().catch(console.error)
