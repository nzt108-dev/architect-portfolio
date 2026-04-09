import 'dotenv/config'
import { createClient } from '@libsql/client'

const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
})

async function migrate() {
    console.log('Creating AgentSuggestion table on Turso...')
    
    await client.execute(`
        CREATE TABLE IF NOT EXISTS "AgentSuggestion" (
            "id" TEXT PRIMARY KEY NOT NULL,
            "projectId" TEXT NOT NULL,
            "type" TEXT NOT NULL,
            "title" TEXT NOT NULL,
            "description" TEXT NOT NULL,
            "impact" TEXT NOT NULL DEFAULT 'medium',
            "effort" TEXT NOT NULL DEFAULT 'medium',
            "status" TEXT NOT NULL DEFAULT 'pending',
            "aiModel" TEXT NOT NULL DEFAULT '',
            "reasoning" TEXT NOT NULL DEFAULT '',
            "codeSnippet" TEXT NOT NULL DEFAULT '',
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "reviewedAt" DATETIME,
            CONSTRAINT "AgentSuggestion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
    `)
    
    console.log('✅ AgentSuggestion table created successfully!')
    process.exit(0)
}

migrate().catch(err => {
    console.error('Migration failed:', err)
    process.exit(1)
})
