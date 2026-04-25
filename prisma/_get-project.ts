import { createClient } from '@libsql/client'
import 'dotenv/config'

const client = createClient({ url: process.env.DATABASE_URL!, authToken: process.env.DATABASE_AUTH_TOKEN })

async function main() {
    const slug = process.argv[2] || 'spotbench'
    const r = await client.execute({ sql: `SELECT * FROM "Project" WHERE slug = ?`, args: [slug] })
    const row = r.rows[0]
    if (!row) { console.log('Not found'); return }
    Object.entries(row).forEach(([k, v]) => v && v !== '[]' && v !== '' && console.log(`${k}: ${v}`))
}
main().catch(console.error)
