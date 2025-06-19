"use server";

import { getUser } from "@/lib/auth/auth-session";
import { PrismaClient } from "@/lib/generated/prisma";
import { slugify } from "@/lib/utils";

const prisma = new PrismaClient();


async function generateUniqueSlug(base: string, userId: string): Promise<string> {
  let slug = slugify(base);
  let count = 1;

  while (await prisma.channel.findFirst({ where: { slug, userId } })) {
    slug = `${slugify(base)}-${count++}`;
  }

  return slug;
}


export async function getOrCreateDefaultChannel() {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const existingChannel = await prisma.channel.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  if (existingChannel) return existingChannel;

  const slug = await generateUniqueSlug("default", user.id);

  const newChannel = await prisma.channel.create({
    data: {
      userId: user.id,
      name: "default",
      slug,
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

export async function createChannel(data: { name: string; description?: string }) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

   const slug = slugify(data.name);

   console.log(slug, "slug");

  // Optionnel : vérifier unicité du slug, ajouter un suffixe si besoin (voir note plus bas)

  return prisma.channel.create({
    data: {
      name: data.name,
      description: data.description || "",
      slug,
      user: {
        connect: { id: user.id },
      },
    },
  });
}
