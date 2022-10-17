import { BaseRepository } from "./base-repository.js";

export default class MessagerRepository extends BaseRepository {
    constructor(prismaModel, messager) {
      super(prismaModel);
      this.messager = messager;
    }
  
    async fingUnique(opts) {
      return await this.prismaModel.findUnique({
        ...opts,
        where: {
          ...opts.where,
        }
      })
    }
    async fingMany(opts) {
      return await this.prismaModel.findMany({
        ...opts,
        where: {
          ...opts.where,
          messagerId: this.messager.id.toString()
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