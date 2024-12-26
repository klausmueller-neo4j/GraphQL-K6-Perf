export async function authMiddleware(req) {
  // For local testing, you might simply set a mock user:
  req.user = { sub: "test-user-id" };
  // In real scenarios, decode JWT or attach user context here.
}