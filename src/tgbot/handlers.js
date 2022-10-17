import bot from "./index.js";
import OrderCreateCQ from "./callback-query/order-create.js";

export const pingPong = (msg) => {
    console.log(msg)
    bot.sendMessage(msg.chat.id, "I am alive!");
}

export const callbakck = (callbackQuery) => {
    const data = JSON.parse(callbackQuery.data)
    if(data.cmd === 'order:create') {
        (new OrderCreateCQ()).process(callbackQuery)
    }
    bot.answerCallbackQuery(callbackQuery.id, {text: 'Done'})
}