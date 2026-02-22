import { createClient } from '@libsql/client'
import 'dotenv/config'

const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
})

async function migrate() {
    console.log('🚀 Adding UTM columns...\n')

    const alterations = [
        // ContactSubmission UTM fields
        `ALTER TABLE "ContactSubmission" ADD COLUMN "utmSource" TEXT NOT NULL DEFAULT ''`,
        `ALTER TABLE "ContactSubmission" ADD COLUMN "utmMedium" TEXT NOT NULL DEFAULT ''`,
        `ALTER TABLE "ContactSubmission" ADD COLUMN "utmCampaign" TEXT NOT NULL DEFAULT ''`,
        // PageView UTM fields
        `ALTER TABLE "PageView" ADD COLUMN "utmSource" TEXT NOT NULL DEFAULT ''`,
        `ALTER TABLE "PageView" ADD COLUMN "utmMedium" TEXT NOT NULL DEFAULT ''`,
        `ALTER TABLE "PageView" ADD COLUMN "utmCampaign" TEXT NOT NULL DEFAULT ''`,
    ]

    for (const sql of alterations) {
        try {
            await client.execute(sql)
            console.log(`✅ ${sql.split('"').slice(1, 4).join('"')}`)
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err)
            if (msg.includes('duplicate column')) {
                console.log(`⏭️  Column already exists, skipping`)
            } else {
                console.error(`❌ ${msg}`)
            }
        }
    }
    console.log('\n✅ Done!')
}

migrate().catch(console.error)
