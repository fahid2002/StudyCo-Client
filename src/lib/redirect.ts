const DEFAULT_AUTHENTICATED_ROUTE = '/dashboard';

export function getSafeReturnTo(value: string | null | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return DEFAULT_AUTHENTICATED_ROUTE;
  }

  return value;
}

export function buildLoginUrl(returnTo: string): string {
  return `/login?returnTo=${encodeURIComponent(returnTo)}`;
}
