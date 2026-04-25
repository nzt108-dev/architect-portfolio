import { createClient } from '@libsql/client'
import 'dotenv/config'

const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
})

async function migrate() {
    console.log('🚀 Adding ProjectService table + sentrySlug to Project...\n')

    const steps = [
        {
            name: 'Add sentrySlug to Project',
            sql: `ALTER TABLE "Project" ADD COLUMN "sentrySlug" TEXT NOT NULL DEFAULT ''`,
        },
        {
            name: 'Create ProjectService table',
            sql: `CREATE TABLE IF NOT EXISTS "ProjectService" (
                "id" TEXT NOT NULL PRIMARY KEY,
                "projectId" TEXT NOT NULL,
                "name" TEXT NOT NULL,
                "category" TEXT NOT NULL,
                "url" TEXT NOT NULL DEFAULT '',
                "account" TEXT NOT NULL DEFAULT '',
                "notes" TEXT NOT NULL DEFAULT '',
                "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "ProjectService_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
            )`,
        },
        {
            name: 'Create index on ProjectService.projectId',
            sql: `CREATE INDEX IF NOT EXISTS "ProjectService_projectId_idx" ON "ProjectService"("projectId")`,
        },
    ]

    for (const step of steps) {
        try {
            await client.execute(step.sql)
            console.log(`✅ ${step.name}`)
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err)
            if (msg.includes('duplicate column') || msg.includes('already exists')) {
                console.log(`⏭️  ${step.name} — already exists`)
            } else {
                console.error(`❌ ${step.name}:`, msg)
            }
        }
    }

    console.log('\n✅ Migration complete!')
}

migrate().catch(console.error)
