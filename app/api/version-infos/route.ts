import type { NextRequest } from "next/server";
import { findVersionInfos } from "@/lib/data/version-infos";

/** GET /api/version-infos — Strapi v3 list endpoint used by the desktop apps' update checker. */
export async function GET(req: NextRequest) {
  return Response.json(await findVersionInfos(req.nextUrl.searchParams));
}
