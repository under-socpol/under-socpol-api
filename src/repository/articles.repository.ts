import { prisma } from "@/config/prisma.js";

export async function create(title: string, excerpt: string, content: any, category_id: string, user_id: string) {
  return await prisma.articles.create({
    data: {
      title,
      excerpt,
      content,
      category_id,
      user_id,
    },
  });
}

export async function findAll(take: number, skip: number) {
  const [articles, total] = await Promise.all([
    prisma.articles.findMany({
      select: {
        id: true,
        title: true,
        excerpt: true,
        is_published: true,
        created_at: true,
        updated_at: true,
        category_id: true,
        user_id: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: { is_published: true },
      orderBy: { updated_at: "desc" },
      take,
      skip,
    }),
    prisma.articles.count({ where: { is_published: true } }),
  ]);

  return {
    articles,
    total,
  };
}

export async function findById(id: string) {
  return await prisma.articles.findUnique({
    select: {
      id: true,
      title: true,
      excerpt: true,
      content: true,
      is_published: true,
      created_at: true,
      updated_at: true,
      category_id: true,
      user_id: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: { id },
  });
}

export async function findByCategoryId(category_id: string, take: number, skip: number) {
  const [articles, total] = await Promise.all([
    prisma.articles.findMany({
      select: {
        id: true,
        title: true,
        excerpt: true,
        is_published: true,
        created_at: true,
        updated_at: true,
        category_id: true,
        user_id: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { updated_at: "desc" },
      where: {
        category_id,
        is_published: true,
      },
      take,
      skip,
    }),
    prisma.articles.count({
      where: {
        category_id,
        is_published: true,
      },
    }),
  ]);

  return {
    articles,
    total,
  };
}

export async function findByUserId(user_id: string, take: number, skip: number) {
  const [articles, total] = await Promise.all([
    prisma.articles.findMany({
      select: {
        id: true,
        title: true,
        excerpt: true,
        is_published: true,
        created_at: true,
        updated_at: true,
        category_id: true,
        user_id: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { updated_at: "desc" },
      where: { user_id },
      take,
      skip,
    }),
    prisma.articles.count({ where: { user_id } }),
  ]);

  return {
    articles,
    total,
  };
}

export async function updateById(id: string, title: string, excerpt: string, content: any, category_id: string, user_id: string) {
  return await prisma.articles.update({
    data: {
      title,
      excerpt,
      content,
      category_id,
      user_id,
    },
    where: { id },
  });
}

export async function updateIsPublishedById(id: string, is_published: boolean) {
  return await prisma.articles.update({
    data: { is_published },
    where: { id },
  });
}

export async function deleteById(id: string) {
  return await prisma.articles.delete({
    where: { id },
  });
}
