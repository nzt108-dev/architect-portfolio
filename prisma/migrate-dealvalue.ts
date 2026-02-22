import { createClient } from '@libsql/client'
import 'dotenv/config'

const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
})

async function migrate() {
    console.log('🚀 Adding dealValue to ContactSubmission...\n')
    try {
        await client.execute(`ALTER TABLE "ContactSubmission" ADD COLUMN "dealValue" INTEGER NOT NULL DEFAULT 0`)
        console.log('✅ Added dealValue column')
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        if (msg.includes('duplicate') || msg.includes('already exists')) {
            console.log('⏭️  dealValue column already exists')
        } else {
            console.error(`❌ ${msg}`)
        }
    }
    console.log('\n✅ Done!')
}

migrate().catch(console.error)
