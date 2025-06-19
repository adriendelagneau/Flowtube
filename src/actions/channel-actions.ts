"use server";

import { getUser } from "@/lib/auth/auth-session";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();


export async function getOrCreateDefaultChannel() {
   const user = await getUser();
     if (!user) throw new Error("Unauthorized");

  // Find the first channel
  const existingChannel = await prisma.channel.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  if (existingChannel) return existingChannel;

  // Create a "default" channel if none exist
  const newChannel = await prisma.channel.create({
    data: {
      userId: user.id,
      name: "default",
      // Add any other required fields here
    },
  });

  return newChannel;
}

export async function getUserChannels() {
   const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  return await prisma.channel.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });
}