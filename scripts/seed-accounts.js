import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const accounts = [
    {
      name: "Teacher Account",
      email: "teacher@zimplar.com",
      password: "teacher123",
      role: "TEACHER",
    },
    {
      name: "Student Account",
      email: "student@zimplar.com",
      password: "student123",
      role: "STUDENT",
    },
    {
      name: "Ministry Account",
      email: "org@zimplar.com",
      password: "org123",
      role: "ORG_ADMIN",
    },
    {
      name: "NGO Account",
      email: "ngo@zimplar.com",
      password: "ngo123",
      role: "ORG_ADMIN",
    },
    {
      name: "Private School Head",
      email: "private@zimplar.com",
      password: "private123",
      role: "ORG_ADMIN",
    },
    {
      name: "Platform Admin",
      email: "admin1@zimplar.com",
      password: "admin123acess",
      role: "ADMIN",
    },
  ];

  console.log("Starting account seeding...");

  for (const account of accounts) {
    const hashedPassword = await bcrypt.hash(account.password, 10);
    
    await prisma.user.upsert({
      where: { email: account.email },
      update: {
        password: hashedPassword,
        role: account.role,
        name: account.name,
      },
      create: {
        email: account.email,
        name: account.name,
        password: hashedPassword,
        role: account.role,
      },
    });
    console.log(`- Created/Updated account: ${account.email} (${account.role})`);
  }

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
