import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function adminRedirect(
  request: NextRequest,
  responseWithSession: NextResponse,
  reason: "sessao" | "sem-permissao",
) {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = `?motivo=${reason}`;

  const response = NextResponse.redirect(url);
  responseWithSession.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");

  return response;
}

function adminHomeRedirect(
  request: NextRequest,
  responseWithSession: NextResponse,
) {
  const url = request.nextUrl.clone();
  url.pathname = "/admin";
  url.search = "";

  const response = NextResponse.redirect(url);
  responseWithSession.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");

  return response;
}

export async function updateAdminSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });

          Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
        },
      },
    },
  );

  // Do not place logic between client creation and token validation.
  const { data, error } = await supabase.auth.getClaims();
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if ((!data?.claims || error) && !isLoginRoute) {
    return adminRedirect(request, response, "sessao");
  }

  if (data?.claims) {
    const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

    if (isLoginRoute && !adminError && isAdmin) {
      return adminHomeRedirect(request, response);
    }

    if (!isLoginRoute && (adminError || !isAdmin)) {
      return adminRedirect(request, response, "sem-permissao");
    }
  }

  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");

  return response;
}
