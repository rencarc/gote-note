import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
  
};

export async function middleware(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch (error) {
    console.error("🔥 Middleware failed:", error);
    // 防止直接抛出 500，跳转到错误页或主页
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // ❌ request.cookies 是只读的，不能调用 set
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const isAuthRoute =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/sign-up";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 登录状态下访问登录页，跳转到首页
  if (isAuthRoute && user) {
    return NextResponse.redirect(
      new URL("/", process.env.NEXT_PUBLIC_BASE_URL),
    );
  }

  const { searchParams, pathname } = new URL(request.url);

  // 首页没有 noteId 参数 → 自动重定向
  if (!searchParams.get("noteId") && pathname === "/" && user) {
    try {
      const { newestNoteId } = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-newest-note?userId=${user.id}`,
      ).then((res) => res.json());

      if (newestNoteId) {
        const url = request.nextUrl.clone();
        url.searchParams.set("noteId", newestNoteId);
        return NextResponse.redirect(url);
      }

      const { noteId } = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/create-new-note?userId=${user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      ).then((res) => res.json());

      const url = request.nextUrl.clone();
      url.searchParams.set("noteId", noteId);
      return NextResponse.redirect(url);
    } catch (e) {
      console.error("🔥 noteId fetch/create failed:", e);
      return supabaseResponse;
    }
  }

  return supabaseResponse;
}
