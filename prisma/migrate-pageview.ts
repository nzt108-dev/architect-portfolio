import { createClient } from '@libsql/client'
import 'dotenv/config'

const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
})

async function migrate() {
    console.log('🚀 Creating PageView table...\n')
    try {
        await client.execute(`
            CREATE TABLE IF NOT EXISTS "PageView" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "path" TEXT NOT NULL,
                "referrer" TEXT NOT NULL DEFAULT '',
                "country" TEXT NOT NULL DEFAULT '',
                "device" TEXT NOT NULL DEFAULT '',
                "browser" TEXT NOT NULL DEFAULT '',
                "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `)
        console.log('✅ Created PageView table')

        await client.execute(`CREATE INDEX IF NOT EXISTS "PageView_path_idx" ON "PageView"("path")`)
        await client.execute(`CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON "PageView"("createdAt")`)
        console.log('✅ Created indexes')
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error(`❌ ${msg}`)
    }
    console.log('\n✅ Done!')
}

migrate().catch(console.error)
