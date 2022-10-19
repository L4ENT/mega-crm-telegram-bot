import config from "../../config.js"

export function orderFormLink(order){ 
    return `${config.PUBLIC_URL}/order-form?t=${order.id}`
}