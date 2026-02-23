/**
 * Build absolute API URLs for both development and production
 * In development: uses localhost
 * In production: uses doingutahdaily.com
 */
export function getApiUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  return `${baseUrl}/api${path.startsWith('/') ? path : `/${path}`}`
}
