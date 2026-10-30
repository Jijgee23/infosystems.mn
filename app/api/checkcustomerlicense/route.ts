import { readBody, strapiError, verifyLicenseToken } from "@/lib/legacy";

/**
 * POST /api/checkcustomerlicense — kept from Strapi, where it was a stub: it only checks
 * that a valid token (Authorization: Bearer … , or body.token) was sent.
 */
export async function POST(req: Request) {
  const body = await readBody(req);
  if (!body.token) return strapiError(400, "токен - оо дамжуулна уу");
  const header = req.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : String(body.token);
  try {
    await verifyLicenseToken(token);
  } catch {
    return strapiError(400, "хүчингүй токен байна!");
  }
  return Response.json({ message: "done ✔" });
}
