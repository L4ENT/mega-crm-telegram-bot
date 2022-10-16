const baseSelect = {
  id: true,
  name: true,
  code: true,
};

export default {
  async filterBy(prisma, where) {
    return await prisma.messager.findMany({
      where,
      select: baseSelect,
    });
  },
  async getUnique(prisma, where) {
    return await prisma.messager.findUnique({
      where,
      select: baseSelect,
    });
  },
};
