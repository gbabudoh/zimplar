import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: Role | string;
  }

  interface Session {
    user: {
      role?: Role | string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role | string;
  }
}

declare module 'hls.js';
