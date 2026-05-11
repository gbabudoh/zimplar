import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers.filter(p => p.id !== "credentials"),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Check if user exists in database
        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (user && "password" in user && typeof user.password === "string" && user.password) {
          const isPasswordCorrect = await bcrypt.compare(password, user.password);
          if (isPasswordCorrect) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role
            };
          }
        }

        return null;
      },
    }),
  ],
});
