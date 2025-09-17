import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isPublic =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/api/auth") ||
        nextUrl.pathname.startsWith("/_next") ||
        nextUrl.pathname.startsWith("/images") ||
        ["/favicon.ico", "/robots.txt", "/sitemap.xml"].includes(nextUrl.pathname);
      if (isPublic) return true;
      return !!auth?.user; 
    }
  }
});