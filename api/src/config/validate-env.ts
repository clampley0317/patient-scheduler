const REQUIRED_ENV_VARS = ['DATABASE_URL'] as const

export function validateEnv(config: Record<string, unknown>) {
  const missing = REQUIRED_ENV_VARS.filter((name) => !config[name])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    )
  }

  return config
}
