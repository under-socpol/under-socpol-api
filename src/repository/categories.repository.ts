import { prisma } from "@/config/prisma.js";

export async function create(name: string, description: string) {
  return await prisma.categories.create({
    data: {
      name,
      description,
    },
  });
}

export async function findAll() {
  return await prisma.categories.findMany();
}

export async function findByName(name: string) {
  return await prisma.categories.findFirst({
    where: { name },
  });
}

export async function updateById(id: string, name: string, description: string) {
  return await prisma.categories.update({
    data: {
      name,
      description,
    },
    where: { id },
  });
}

export async function deleteById(id: string) {
  return await prisma.categories.delete({
    where: { id },
  });
}
