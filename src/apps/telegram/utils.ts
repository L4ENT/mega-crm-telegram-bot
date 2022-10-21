import db from "../../db";

export async function getTelegramMessager() {
  return await db.messager.findUnique({ where: { code: "telegram" } });
}

export async function getFlowFromMessage(msg) {
  const dbFlow = await db.messagerFlow.findUnique({
    where: {
      userUid_chatUid: {
        userUid: msg.from.id.toString(),
        chatUid: msg.chat.id.toString(),
      },
    },
  });

  if (!dbFlow) return null;

  return {
    ...dbFlow,
    data: JSON.parse(dbFlow.data),
  };
}

export async function getFlowFromCbq(cbq) {
  const dbFlow = await db.messagerFlow.findUnique({
    where: {
      userUid_chatUid: {
        userUid: cbq.message.from.id.toString(),
        chatUid: cbq.message.chat.id.toString(),
      },
    },
  });

  if (!dbFlow) return null;
  return {
    ...dbFlow,
    data: JSON.parse(dbFlow.data),
  };
}
