import db from "../../../../prisma/db.js";
import MessagerRepository from "../../../repository/messager-repository.js";
import { getTelegramMessager } from "../utils.js";


async function simpleMessageMiddleware(update) {
  const { tgUser, tgChannel, tgChat } = {
    tgUser: update?.message?.from,
    tgChannel: update?.message?.chat?.type == "group" ? update.message.chat : null,
    tgChat: update?.message?.chat?.type == "private" ? update.message.chat : null,
  };
  
  if (!tgUser) {
    return;
  }
  const messager = await getTelegramMessager()

  const mUserRep = new MessagerRepository(db.messagerUser, messager);
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
    const mChatRep = new MessagerRepository(db.messagerChat, messager);
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
      db.messagerChannel,
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
          connect: {
            messagerUserId_messagerChannelId: {
              messagerUserId: mUser.id,
              messagerChannelId: mChannel.id,
            },
          },
        },
      },
    });
  }

  return update;
}

export default simpleMessageMiddleware;
