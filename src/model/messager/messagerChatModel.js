const baseSelect = {
  id: true,
  name: true,
  code: true,
};

export default {
  async filterBy(prisma, where) {
    return await prisma.messagerChat.findMany({
      where,
      select: baseSelect,
    });
  },
};
