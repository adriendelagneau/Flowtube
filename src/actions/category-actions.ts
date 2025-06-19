"use server";

import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();


export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

