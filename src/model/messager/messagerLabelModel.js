const baseSelect = {
  id: true,
  name: true,
  code: true,
};

export default {
  async filterBy(prisma, where) {
    return await prisma.messagerLabel.findMany({
      where,
      select: baseSelect,
    });
  },
};
