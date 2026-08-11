import type { NextRequest } from "next/server";
import { updateAdminSession } from "@/src/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateAdminSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
