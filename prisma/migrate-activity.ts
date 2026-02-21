import { createClient } from '@libsql/client'
import 'dotenv/config'

const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
})

async function migrate() {
    console.log('🚀 Adding ActivityLog table to Turso...\n')

    const migrations = [
        `CREATE TABLE IF NOT EXISTS "ActivityLog" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "projectId" TEXT,
            "type" TEXT NOT NULL,
            "title" TEXT NOT NULL,
            "details" TEXT NOT NULL DEFAULT '',
            "author" TEXT NOT NULL DEFAULT 'agent',
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "ActivityLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )`,
    ]

    for (const sql of migrations) {
        try {
            await client.execute(sql)
            console.log(`✅ ${sql.substring(0, 60)}...`)
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err)
            if (message.includes('already exists')) {
                console.log(`⏭️  Already exists`)
            } else {
                console.error(`❌ Error: ${message}`)
            }
        }
    }

    // Verify
    const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    console.log('\nTables:', tables.rows.map(r => r.name))
    console.log('\n✅ Migration complete!')
}

migrate().catch(console.error)
