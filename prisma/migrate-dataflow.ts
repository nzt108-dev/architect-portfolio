import { createClient } from '@libsql/client'
import 'dotenv/config'

const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
})

async function migrate() {
    console.log('🚀 Adding dataFlowHtml column to Project table...\n')

    try {
        await client.execute(`ALTER TABLE "Project" ADD COLUMN "dataFlowHtml" TEXT NOT NULL DEFAULT ''`)
        console.log('✅ Added dataFlowHtml column')
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        if (msg.includes('duplicate column') || msg.includes('already exists')) {
            console.log('⏭️  dataFlowHtml column already exists')
        } else {
            console.error('❌', msg)
        }
    }

    console.log('\n✅ Done!')
}

migrate().catch(console.error)
