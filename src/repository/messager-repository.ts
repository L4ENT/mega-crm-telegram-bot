import { PrismaRepository } from "./prisma-repository";

export default class MessagerRepository extends PrismaRepository {
    
    messager: any

    constructor(prismaModel: any, messager: any) {
      super(prismaModel);
      this.messager = messager;
    }
  
    async findUnique(opts) {
      return await this.prismaModel.findUnique({
        ...opts,
        where: {
          ...opts.where,
        }
      })
    }
    async findMany(opts) {
      return await this.prismaModel.findMany({
        ...opts,
        where: {
          ...opts.where,
          messagerId: this.messager.id
        }
      })
    }
    async create(opts) {
      return await this.prismaModel.create({
        ...opts,
        data: {
          ...opts.data,
          messagerId: this.messager.id
        }
      })
    }
    async update(opts) {
      return await this.prismaModel.update(opts)
    }
    async upsert(opts) {
      return await this.prismaModel.upsert({
        ...opts,
        where: {
          ...opts.where,
        },
        create: {
          ...opts.create,
          messager: {
            connect: {
              id: this.messager.id
            }
          }
        },
        update: {
          ...opts.update,
          messager: {
            connect: {
              id: this.messager.id
            }
          }
        }
      })
    }
  }