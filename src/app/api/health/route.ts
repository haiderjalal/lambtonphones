/**
 * Liveness check for uptime monitors. Deliberately returns no configuration or database details.
 */
export function GET(): Response {
  return Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } });
}
