const { cookies } = require("next/headers");
const { NextResponse } = require("next/server");
const { verifyToken } = require("./helpers/jwt");

export async function middleware(req) {
  const cookie = cookies().get("Authorization");
  // console.log("cookie", cookie);
  if (req.nextUrl.pathname.startsWith("/login")) {
    if (cookie) {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }

  if (req.nextUrl.pathname === "/") {
    if (cookie) {
      return NextResponse.redirect(new URL("/home", req.url));
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (
    req.nextUrl.pathname.startsWith("/home") ||
    req.nextUrl.pathname.startsWith("/spot")
  ) {
    if (!cookie) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (
    req.nextUrl.pathname.startsWith("/api/parkspot") ||
    req.nextUrl.pathname.startsWith("/api/users") ||
    req.nextUrl.pathname.startsWith("/api/trx") ||
    req.nextUrl.pathname.startsWith("/api/reviews")
  ) {
    if (!cookie) {
      return Response.json(
        {
          msg: "Unauthenticated",
        },
        {
          status: 401,
        }
      );
    }
    const [bearer, token] = cookie.value.split(" ");
    if (bearer !== "Bearer") {
      return Response.json(
        {
          msg: "Unauthenticated",
        },
        {
          status: 401,
        }
      );
    }
    const payload = await verifyToken(token);

    const requestHeaders = new Headers(req.headers);
    // You can also set request headers in NextResponse.next
    const response = NextResponse.next({
      request: {
        // New request headers
        headers: requestHeaders,
      },
    });

    // Set a new response header `x-id`
    response.headers.set("x-id", payload.id);
    response.headers.set("x-role", payload.role);
    // console.log(response.headers)
    return response;
  }
}

export const config = {
  matcher: [
    "/api/parkspot/:path*",
    "/api/reviews",
    "/api/users/:path*",
    "/api/trx/:path*",
    "/login",
    "/register",
    "/home",
    "/spot/:path*",
    "/",
  ],
};
