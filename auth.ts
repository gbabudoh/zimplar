import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
    }),
    Credentials({
      name: "Demo",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Stateless demo accounts for instant verification
        if (email === "org@zimplar.com" && password === "org123") {
          return { id: "org-demo", email, name: "Ministry Official", role: "ORG_ADMIN" };
        }

        if (email === "teacher@zimplar.com" && password === "teacher123") {
          return { id: "teacher-demo", email, name: "Demo Teacher", role: "TEACHER" };
        }

        if (email === "student@zimplar.com" && password === "student123") {
          return { id: "student-demo", email, name: "Demo Student", role: "STUDENT" };
        }

        if (email === "admin1@zimplar.com" && password === "admin123acess") {
          return { id: "admin-demo", email, name: "Admin User", role: "ADMIN" };
        }

        if (email === "ngo@zimplar.com" && password === "ngo123") {
          return { id: "ngo-demo", email, name: "Impact Director", role: "ORG_ADMIN" };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-expect-error - role is on user
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        // @ts-expect-error - role is on token
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
