"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
// @ts-expect-error - Prisma client generation sync
import { PlanType, OrgType, SubStatus, TxType, TxStatus } from "@prisma/client";

/**
 * Validates that the current user is authenticated.
 */
async function checkAuth() {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized: Access denied.");
  }
  return session as { user: { id: string } };
}

export async function createSubscription(data: {
  planType: PlanType;
  orgType: OrgType;
  amount: number;
}) {
  const session = await checkAuth();
  const userId = session.user.id as string;

  try {
    // 1. Create the subscription
    // @ts-expect-error - Prisma client generation sync
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planType: data.planType,
        orgType: data.orgType,
        amount: data.amount,
        status: SubStatus.ACTIVE,
        startDate: new Date(),
        // End date could be +30 days or +1 year
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
      }
    });

    // 2. Create a transaction log
    // @ts-expect-error - Prisma client generation sync
    await prisma.transaction.create({
      data: {
        userId,
        amount: data.amount,
        type: TxType.SUBSCRIPTION,
        status: TxStatus.COMPLETED,
        reference: `SUB-${subscription.id.slice(-8).toUpperCase()}`,
      }
    });

    // 3. Update user role if it's a teacher plan
    if (data.planType !== PlanType.FREE) {
       // Optional: Logic to grant specific dashboard permissions
    }

    revalidatePath("/dashboard/billing");
    return subscription;
  } catch (error) {
    console.error("[MONETIZATION_SUB] Failed to create subscription:", error);
    throw new Error("Subscription creation failed.");
  }
}

export async function getUserSubscription() {
  const session = await checkAuth();
  try {
    // @ts-expect-error - Prisma client generation sync
    const subscription = await prisma.subscription.findFirst({
      where: { userId: session.user?.id as string },
      orderBy: { createdAt: "desc" },
    });
    return subscription;
  } catch (error) {
    console.error("[MONETIZATION_SUB] Fetch failed:", error);
    return null;
  }
}

export async function getUserTransactions() {
  const session = await checkAuth();
  try {
    // @ts-expect-error - Prisma client generation sync
    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user?.id as string },
      orderBy: { createdAt: "desc" },
    });
    return transactions;
  } catch (error) {
    console.error("[MONETIZATION_TX] Fetch failed:", error);
    return [];
  }
}

export async function topUpData(gbAmount: number, cost: number) {
  const session = await checkAuth();
  const userId = session.user.id as string;

  try {
    // 1. Get or create data allocation
    // @ts-expect-error - Prisma client generation sync
    let allocation = await prisma.dataAllocation.findUnique({
      where: { userId }
    });

    if (!allocation) {
      // @ts-expect-error - Prisma client generation sync
      allocation = await prisma.dataAllocation.create({
        data: { userId, totalCapGB: 5.0, usedGB: 0.0 }
      });
    }

    // 2. Create Transaction
    // @ts-expect-error - Prisma client generation sync
    const tx = await prisma.transaction.create({
      data: {
        userId,
        amount: cost,
        type: TxType.DATA_TOPUP,
        status: TxStatus.COMPLETED,
        reference: `DATA-${userId.slice(-4)}-${Date.now().toString().slice(-4)}`
      }
    });

    // 3. Add to Allocation
    // @ts-expect-error - Prisma client generation sync
    await prisma.dataAllocation.update({
      where: { id: allocation.id },
      data: {
        totalCapGB: { increment: gbAmount }
      }
    });

    // 4. Create Data Purchase log
    // @ts-expect-error - Prisma client generation sync
    await prisma.dataPurchase.create({
      data: {
        allocationId: allocation.id,
        amountGB: gbAmount,
        cost,
        transactionId: tx.id
      }
    });

    revalidatePath("/dashboard/billing");
    return { success: true };
  } catch (error) {
    console.error("[MONETIZATION_DATA] Top-up failed:", error);
    throw new Error("Data top-up failed.");
  }
}

export async function updateOrganizationProfile(data: {
  name: string;
  description?: string;
  website?: string;
  regNumber?: string;
  contactEmail?: string;
  address?: string;
}) {
  const session = await checkAuth();
  const userId = session.user.id;

  try {
    // @ts-expect-error - Prisma client generation sync
    const profile = await prisma.organizationProfile.upsert({
      where: { userId },
      update: data,
      create: { ...data, userId },
    });
    revalidatePath("/dashboard/billing");
    return profile;
  } catch (error) {
    console.error("[MONETIZATION_ORG] Update failed:", error);
    throw new Error("Failed to update organization profile.");
  }
}

export async function getOrganizationProfile() {
  const session = await checkAuth();
  try {
    // @ts-expect-error - Prisma client generation sync
    const profile = await prisma.organizationProfile.findUnique({
      where: { userId: session.user.id },
    });
    return profile;
  } catch (error) {
    console.error("[MONETIZATION_ORG] Fetch failed:", error);
    return null;
  }
}

export async function getDataAllocation() {
  const session = await checkAuth();
  try {
    // @ts-expect-error - Prisma client generation sync
    const allocation = await prisma.dataAllocation.findUnique({
      where: { userId: session.user.id },
      include: {
        purchases: {
          orderBy: { purchasedAt: "desc" },
          take: 5
        }
      }
    });
    return allocation;
  } catch (error) {
    console.error("[MONETIZATION_DATA] Fetch failed:", error);
    return null;
  }
}
