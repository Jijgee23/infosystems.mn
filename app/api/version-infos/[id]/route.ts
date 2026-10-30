import type { NextRequest } from "next/server";
import { countVersionInfos, findVersionInfo } from "@/lib/data/version-infos";
import { strapiError } from "@/lib/legacy";

/** GET /api/version-infos/:id and /api/version-infos/count */
export async function GET(req: NextRequest, ctx: RouteContext<"/api/version-infos/[id]">) {
  const { id } = await ctx.params;
  if (id === "count") return Response.json(await countVersionInfos(req.nextUrl.searchParams));
  const row = Number.isInteger(Number(id)) ? await findVersionInfo(Number(id)) : null;
  return row ? Response.json(row) : strapiError(404, "Not Found");
}
