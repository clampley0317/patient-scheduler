import { existsSync } from 'node:fs'
import { DataSource } from 'typeorm'

if (existsSync('.env')) {
  process.loadEnvFile()
}

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
})
