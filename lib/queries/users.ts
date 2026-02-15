import prisma from "@/lib/prisma"

export async function getUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { cases: true },
      },
    },
  })
}
