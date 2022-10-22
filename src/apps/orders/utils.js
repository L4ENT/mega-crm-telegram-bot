// import config from "../../config";

// export function orderFormLink(order) {
//   return `${config.PUBLIC_URL}/order-form?t=${order.id}`;
// }

// export function orderMessageForDispatcher(order) {
//   let message =  (
//     `Заявка № ${order.id}\n\n` +
//     `<b>Имя клиента</b>: ${order.clientName}\n` +
//     `<b>Номер телефона</b>: ${order.clientPhone}\n` +
//     `<b>Доп. номер телефона</b>: ${order.additionalPhone}\n` +
//     `<b>Адрес</b>: ${order.fullAddress}\n` +
//     `<b>Неисправность</b>: ${order.defect}\n` +
//     `<b>Марка</b>: ${order.brand}\n` +
//     `<b>Модель</b>: ${order.model}\n` +
//     `<b>Тип устройства</b>: ${order.deviceType.title}\n`
//   );

//   if(order.masterId) {
//     message += `\n<b>Мастер</b>: ${order.master.fullName}\n`
//   }
//   return message
// }

// export function orderMessageForMaster(order) {
//   return (
//     `Заявка № ${order.id}\n\n` +
//     `<b>Имя клиента</b>: ${order.clientName}\n` +
//     `<b>Номер телефона</b>: ${order.clientPhone}\n` +
//     `<b>Доп. номер телефона</b>: ${order.additionalPhone}\n` +
//     `<b>Адрес</b>: ${order.fullAddress}\n` +
//     `<b>Неисправность</b>: ${order.defect}\n` +
//     `<b>Марка</b>: ${order.brand}\n` +
//     `<b>Модель</b>: ${order.model}\n` +
//     `<b>Тип устройства</b>: ${order.deviceType.title}\n`
//   );
// }

// export function dispatcherOrderInlineKB(order) {
//   let inline_keyboard = [
//     [
//       {
//         text: "Назначить на мастера",
//         callback_data: JSON.stringify({
//           cmd: "order:setmaster",
//           orderId: order.id,
//         }),
//       },
//     ],
//   ];
  
//   if(order.masterId) {
//     inline_keyboard =  [
//       [
//         {
//           text: "Сменить мастера",
//           callback_data: JSON.stringify({
//             cmd: "order:changemaster",
//             orderId: order.id,
//           }),
//         },
//       ],
//     ];
//   }
  
//   return inline_keyboard
// }
