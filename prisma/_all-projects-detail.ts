import { createClient } from '@libsql/client'
import 'dotenv/config'

const client = createClient({ url: process.env.DATABASE_URL!, authToken: process.env.DATABASE_AUTH_TOKEN })

async function main() {
    const r = await client.execute(`SELECT id, slug, title, status, stack, services, localPath, deployUrl, backendUrl FROM "Project" ORDER BY status, title`)
    for (const row of r.rows) {
        const stack = row.stack ? JSON.parse(row.stack as string) : []
        const services = row.services ? JSON.parse(row.services as string) : []
        if (stack.length || services.length || row.deployUrl || row.backendUrl) {
            console.log(`\n── ${row.title} (${row.slug}) [${row.status}]`)
            if (row.deployUrl) console.log(`   deploy: ${row.deployUrl}`)
            if (row.backendUrl) console.log(`   backend: ${row.backendUrl}`)
            if (row.localPath) console.log(`   local: ${row.localPath}`)
            if (stack.length) console.log(`   stack: ${stack.join(', ')}`)
            if (services.length) console.log(`   services: ${services.join(', ')}`)
        }
    }
}
main().catch(console.error)
