import { NextRequest, NextResponse } from "next/server";
import { jellyfin } from "./client";
import { getUserApi } from "@jellyfin/sdk/lib/utils/api";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const server = request.cookies.get("jf_server");
  const token = request.cookies.get("jf_token");
  const redirect = NextResponse.redirect(new URL("/login", request.url));
  if (!server || !token) return redirect;
  const api = jellyfin.createApi(server.value, token.value);
  let user;
  try {
    user = await getUserApi(api).getCurrentUser();
  } catch {
    api.logout();
    redirect.cookies.delete("jf_server");
    redirect.cookies.delete("jf_token");
    return redirect;
  }
  if (!user || user.status.toString().startsWith("4")) {
    api.logout();
    redirect.cookies.delete("jf_server");
    redirect.cookies.delete("jf_token");
    return redirect;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
}