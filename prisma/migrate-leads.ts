import { createClient } from '@libsql/client'
import 'dotenv/config'

const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
})

async function migrate() {
    console.log('🚀 Adding lead pipeline fields to ContactSubmission...\n')

    const migrations = [
        `ALTER TABLE "ContactSubmission" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'new'`,
        `ALTER TABLE "ContactSubmission" ADD COLUMN "label" TEXT NOT NULL DEFAULT ''`,
        `ALTER TABLE "ContactSubmission" ADD COLUMN "notes" TEXT NOT NULL DEFAULT ''`,
    ]

    for (const sql of migrations) {
        try {
            await client.execute(sql)
            console.log(`✅ ${sql.substring(0, 70)}...`)
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err)
            if (message.includes('duplicate column') || message.includes('already exists')) {
                console.log(`⏭️  Column already exists, skipping`)
            } else {
                console.error(`❌ Error: ${message}`)
            }
        }
    }

    console.log('\n✅ Migration complete!')
}

migrate().catch(console.error)
