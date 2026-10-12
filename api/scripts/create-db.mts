import pg from 'pg'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is not defined in the environment variables.`)
  }
  return value
}

function parseAppDatabaseUrl(databaseUrl: string) {
  const url = new URL(databaseUrl)
  const user = decodeURIComponent(url.username)
  const password = decodeURIComponent(url.password)
  const database = decodeURIComponent(url.pathname.slice(1))

  if (!user) throw new Error('DATABASE_URL is missing a username.')
  if (!password) throw new Error('DATABASE_URL is missing a password.')
  if (!database) throw new Error('DATABASE_URL is missing a database name.')

  return { user, password, database }
}

async function main() {
  const adminDatabaseUrl = requireEnv('ADMIN_DATABASE_URL')
  const { user, password, database } = parseAppDatabaseUrl(
    requireEnv('DATABASE_URL'),
  )

  const client = new pg.Client({ connectionString: adminDatabaseUrl })
  await client.connect()

  try {
    const role = await client.query(
      'SELECT 1 FROM pg_roles WHERE rolname = $1',
      [user],
    )
    if (role.rowCount === 0) {
      await client.query(
        `CREATE ROLE ${client.escapeIdentifier(user)} LOGIN PASSWORD ${client.escapeLiteral(password)}`,
      )
      console.log(`Created role "${user}".`)
    } else {
      console.log(`Role "${user}" already exists.`)
    }

    const db = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [database],
    )
    if (db.rowCount === 0) {
      await client.query(
        `CREATE DATABASE ${client.escapeIdentifier(database)} OWNER ${client.escapeIdentifier(user)}`,
      )
      console.log(`Created database "${database}".`)
    } else {
      console.log(`Database "${database}" already exists.`)
    }
  } finally {
    await client.end()
  }
}

main().catch((error: unknown) => {
  console.error(
    'Failed to create database:',
    error instanceof Error ? error.message : error,
  )
  process.exitCode = 1
})
