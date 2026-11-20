/** Read a required environment variable (from .env) or fail with a clear message. */
export function requiredEnv(key: string): string {
  const value = (process.env[key] || '').trim()
  if (!value) throw new Error(`${key} is not set; add it to the project .env`)
  return value
}
