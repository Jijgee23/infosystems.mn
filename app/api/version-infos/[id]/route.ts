import type { NextRequest } from "next/server";
import { BadQueryError, countVersionInfos, findVersionInfo } from "@/lib/data/version-infos";
import { strapiError } from "@/lib/legacy";

/** GET /api/version-infos/:id and /api/version-infos/count */
export async function GET(req: NextRequest, ctx: RouteContext<"/api/version-infos/[id]">) {
  const { id } = await ctx.params;
  if (id === "count") {
    try {
      return Response.json(await countVersionInfos(req.nextUrl.searchParams));
    } catch (e) {
      if (e instanceof BadQueryError) return strapiError(400, e.message);
      throw e;
    }
  }
  // Positive 32-bit ids only: a larger number would overflow the integer column.
  const n = Number(id);
  const row = Number.isInteger(n) && n > 0 && n <= 2_147_483_647 ? await findVersionInfo(n) : null;
  return row ? Response.json(row) : strapiError(404, "Not Found");
}
