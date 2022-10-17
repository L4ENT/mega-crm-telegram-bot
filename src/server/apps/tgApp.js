import messagerModel from "../../model/messager/messagerModel.js";
import MessagerRepository from "../../repository/messager-repository.js";

const splitMessageToEntities = (jsonBody) => {
  const {
    message: { from, chat },
  } = jsonBody;
  return {
    tgUser: from,
    tgChannel: chat.type === "group" ? chat : null,
    tgChat: chat.type === "private" ? chat : null,
  };
};

export default {
  async preprocessMessage(prisma, jsonBody) {
    const { tgUser, tgChannel, tgChat } = splitMessageToEntities(jsonBody);
    const messager = await messagerModel.getUnique(prisma, {
      code: "telegram",
    });
    console.log({ tgUser, tgChannel, tgChat });

    const mUserRep = new MessagerRepository(prisma.messagerUser, messager);
    const mUser = await mUserRep.upsert({
      where: {
        uid_messagerId: { uid: tgUser.username, messagerId: messager.id },
      },
      create: {
        uid: tgUser.username,
        user: { create: { username: tgUser.username } },
      },
    });

    if (tgChat) {
      const mChatRep = new MessagerRepository(prisma.messagerChat, messager);
      await mChatRep.upsert({
        where: {
          uid_messagerId: {
            uid: tgChat.id.toString(),
            messagerId: messager.id,
          },
        },
        create: {
          uid: tgChat.id.toString(),
          messagerUser: {
            connect: {
              id: mUser.id,
            },
          },
        },
      });
    }

    if (tgChannel) {
      const mChannelRep = new MessagerRepository(
        prisma.messagerChannel,
        messager
      );
      const mChannel = await mChannelRep.upsert({
        where: {
          uid_messagerId: {
            uid: tgChannel.id.toString(),
            messagerId: messager.id,
          },
        },
        create: { uid: tgChannel.id.toString(), name: tgChannel.title },
        update: { uid: tgChannel.id.toString(), name: tgChannel.title },
      });

      await mUserRep.update({
        where: {
          uid_messagerId: { uid: tgUser.username, messagerId: messager.id },
        },
        data: {
          channels: {
            connectOrCreate: {
              where: {
                messagerUserId_messagerChannelId: {
                  messagerUserId: tgUser.id,
                  messagerChannelId: mChannel.id,
                },
                
              },
              create: {
                messagerChannelId: mChannel.id,
              }
            },
          },
        },
      });
    }

    return jsonBody;
  },
};
