export class PrismaRepository {
  prismaModel: any
  
  constructor(prismaModel: any) {
    this.prismaModel = prismaModel;
  }

  model() {
    return this.prismaModel;
  }
}
