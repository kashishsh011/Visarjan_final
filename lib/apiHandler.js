/**
 * Wraps an API route handler to catch unhandled errors and return a 500.
 * Usage:
 *   export const GET = withErrorHandling(async (req) => { ... })
 */
export function withErrorHandling(handler) {
  return async function (req, context) {
    try {
      return await handler(req, context)
    } catch (err) {
      console.error('[API Error]', err)
      return Response.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}
