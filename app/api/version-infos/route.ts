import type { NextRequest } from "next/server";
import { BadQueryError, findVersionInfos } from "@/lib/data/version-infos";
import { strapiError } from "@/lib/legacy";

/** GET /api/version-infos — Strapi v3 list endpoint used by the desktop apps' update checker. */
export async function GET(req: NextRequest) {
  try {
    return Response.json(await findVersionInfos(req.nextUrl.searchParams));
  } catch (e) {
    if (e instanceof BadQueryError) return strapiError(400, e.message);
    throw e;
  }
}
