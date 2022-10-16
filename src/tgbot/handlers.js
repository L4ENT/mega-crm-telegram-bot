import bot from "./index.js";

export const pingPong = (msg) => {
    bot.sendMessage(msg.chat.id, "I am alive!");
}