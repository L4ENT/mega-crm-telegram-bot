import { User } from "@prisma/client";
import MasterAgent from "@src/agents/master/MasterAgent";
import db from "@src/db";

export default class MasterManager {
  static async searchByName(query: string) {
    const users: User[] = await db.user.findMany({
      where: {
        fullName: {
          contains: query,
        },
      },
    });
    return users.map((user: User) => new MasterAgent(user.id));
  }
}
