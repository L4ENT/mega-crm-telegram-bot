import MasterAgent from "@src/agents/master/MasterAgent";
import MasterManager from "@src/managers/MasterManager";
import OrderManager from "@src/managers/OrderManager";

export default class AutoAssignTask {
    async run() {
        const unassignedOrders = await OrderManager.getUnassignedOrders()
        for (let order of unassignedOrders) {
            const masterId = await MasterManager.getDefaultMaster(order.deviceTypeId)
            if(masterId) {
                const masterAgent = new MasterAgent(masterId)
                await masterAgent.events.onOrderAssign(order)
            }
        }
    }
}