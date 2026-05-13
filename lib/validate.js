/**
 * Reusable Zod validation helper for API routes.
 * Usage:
 *   const { ok, data, error } = validateBody(myZodSchema, await req.json())
 *   if (!ok) return error
 */
export function validateBody(schema, body) {
  const result = schema.safeParse(body)
  if (!result.success) {
    return {
      ok: false,
      error: Response.json(
        { success: false, error: 'Validation failed', details: result.error.issues },
        { status: 400 }
      ),
    }
  }
  return { ok: true, data: result.data }
}
