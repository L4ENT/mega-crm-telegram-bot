class BaseHandler {
    constructor(prisma) {
        this.prisma = prisma
    }

    async exec(some) {}
}

export default BaseHandler