import { verifyOAuthQueryParams } from "@better-auth/oauth-provider";
import { auth } from "@/auth";

export async function getMcpOAuthQuery(params: Record<string, string | string[] | undefined>) {
  if (typeof params.sig !== "string") return null;

  const signedNames = new Set(["sig", "ba_param", ...[params.ba_param ?? []].flat()]);
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (!signedNames.has(key) || value === undefined) continue;
    for (const item of [value].flat()) query.append(key, item);
  }
  const { secret } = await auth.$context;
  return await verifyOAuthQueryParams(query.toString(), secret) ? query : null;
}
