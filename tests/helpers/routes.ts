import { type Page, expect } from '@playwright/test'

/**
 * DIGIT HCM apps are client-side SPAs: redirects (e.g. to /user/login) happen after the app boots,
 * and a cold load shows the "animation" loader for ~15 s. Route checks therefore poll for up to 45 s.
 */
const ROUTE_TIMEOUT_MS = 45_000

/** Read location without throwing: page.evaluate throws while the app is mid-redirect, and expect.poll does not retry throws. */
export async function currentLocation(page: Page): Promise<{ pathname: string; href: string } | null> {
  try {
    return await page.evaluate(() => ({ pathname: location.pathname, href: location.href }))
  } catch {
    return null
  }
}

/** Current location.href (null while navigating). */
export async function currentHref(page: Page): Promise<string | null> {
  return (await currentLocation(page))?.href ?? null
}

const trimSlash = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p)

/** Poll until location.pathname equals `pathname` (trailing slash ignored). */
export async function expectPathname(page: Page, pathname: string, timeout = ROUTE_TIMEOUT_MS): Promise<void> {
  await expect
    .poll(async () => {
      const loc = await currentLocation(page)
      return loc ? trimSlash(loc.pathname) : null
    }, { timeout, message: `expected location.pathname to be ${pathname}` })
    .toBe(trimSlash(pathname))
}

/** Poll until location.pathname starts with `prefix` (for routes the app may extend or redirect within). */
export async function expectPathnameStartsWith(page: Page, prefix: string, timeout = ROUTE_TIMEOUT_MS): Promise<void> {
  await expect
    .poll(async () => (await currentLocation(page))?.pathname.startsWith(prefix) ?? false,
      { timeout, message: `expected location.pathname to start with ${prefix}` })
    .toBe(true)
}

/** Poll until location.pathname is no longer `pathname` (trailing slash ignored), e.g. after leaving a page. */
export async function expectPathnameNot(page: Page, pathname: string, timeout = ROUTE_TIMEOUT_MS): Promise<void> {
  await expect
    .poll(async () => {
      const loc = await currentLocation(page)
      return loc ? trimSlash(loc.pathname) !== trimSlash(pathname) : false
    }, { timeout, message: `expected location.pathname to change away from ${pathname}` })
    .toBe(true)
}

/** Absolute URL for an origin-relative path. BASE_URL already ends in /workbench-ui/employee, so plain concatenation would double it. */
export function urlFor(baseURL: string, path: string): string {
  return new URL(path, baseURL).toString()
}
