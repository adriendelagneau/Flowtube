"use server";

import { getUser } from "@/lib/auth/auth-session";
import { PrismaClient } from "@/lib/generated/prisma";
import { slugify } from "@/lib/utils";

const prisma = new PrismaClient();

// Generate a unique name based on a base value
async function generateUniqueName(base: string): Promise<string> {
  let name = base;
  let count = 1;
  while (await prisma.channel.findFirst({ where: { name } })) {
    name = `${base}-${count++}`;
  }
  return name;
}

// Generate a unique slug scoped to the base
function generateSlug(name: string): string {
  return slugify(name);
}

async function generateUniqueNameAndSlug(base: string): Promise<{ name: string; slug: string }> {
  const uniqueName = await generateUniqueName(base);
  const slug = generateSlug(uniqueName);
  return { name: uniqueName, slug };
}

export async function getOrCreateDefaultChannel() {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const existingChannel = await prisma.channel.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });
  if (existingChannel) return existingChannel;

  const { name, slug } = await generateUniqueNameAndSlug("default");

  const newChannel = await prisma.channel.create({
    data: {
      userId: user.id,
      name,
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
