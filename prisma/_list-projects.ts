import { createClient } from '@libsql/client'
import 'dotenv/config'

const client = createClient({ url: process.env.DATABASE_URL!, authToken: process.env.DATABASE_AUTH_TOKEN })

async function main() {
    const r = await client.execute('SELECT id, slug, title, status, deployUrl, backendUrl FROM "Project" ORDER BY title')
    r.rows.forEach(row => console.log(JSON.stringify(row)))
}
main().catch(console.error)
