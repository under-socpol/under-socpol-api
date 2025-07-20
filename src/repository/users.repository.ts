import { prisma } from "@/config/prisma.js";

export async function create(name: string, email: string, password: string, email_is_verified?: boolean) {
  return await prisma.users.create({
    data: {
      name,
      email,
      password,
      email_is_verified,
    },
  });
}

export async function findAll(id: string, take: number, skip: number) {
  const [users, total] = await Promise.all([
    prisma.users.findMany({
      where: { NOT: { id } },
      take,
      skip,
    }),
    prisma.users.count({
      where: { NOT: { id } },
    }),
  ]);

  return {
    users,
    total,
  };
}

export async function findByEmail(email: string) {
  return await prisma.users.findUnique({
    where: { email },
  });
}

export async function findById(id: string) {
  return await prisma.users.findUnique({
    where: { id },
  });
}

export async function updateNameById(id: string, name: string) {
  return await prisma.users.update({
    data: { name },
    where: { id },
  });
}

export async function updateEmailById(id: string, email: string) {
  return await prisma.users.update({
    data: { email },
    where: { id },
  });
}

export async function updateEmailIsVerifiedById(id: string) {
  return await prisma.users.update({
    data: { email_is_verified: true },
    where: { id },
  });
}

export async function updatePasswordById(id: string, password: string) {
  return await prisma.users.update({
    data: { password },
    where: { id },
  });
}

type UpdateUserByAdminArgs = {
  id: string;
  name?: string;
  email?: string;
  password?: string;
};

export async function updateById({ id, name, email, password }: UpdateUserByAdminArgs) {
  const data: Record<string, any> = {};

  if (name !== undefined) data.name = name;
  if (email !== undefined) data.email = email;
  if (password !== undefined) data.password = password;

  if (Object.keys(data).length === 0) {
    throw new Error("No fields provided for update.");
  }

  return await prisma.users.update({
    where: { id },
    data,
  });
}

export async function deleteById(id: string) {
  return await prisma.users.delete({
    where: { id },
  });
}
