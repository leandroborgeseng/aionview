import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/((?!login|api/auth|api/admin/bootstrap|api/sync/pbi|api/health|_next/static|_next/image|favicon.ico).*)",
  ],
};

