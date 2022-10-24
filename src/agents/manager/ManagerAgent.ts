import AgentActionsInterface from "@src/agents/AgentActionsInterface";
import AgentEventsInterface from "@src/agents/AgentEventsInterface";
import AgentInterface from "@src/agents/AgentInterface";
import ManagerActions from "@src/agents/manager/actions/ManagerActions";
import ManagerEvents from "@src/agents/manager/events/ManagerEvents";

export default class ManagerAgent implements AgentInterface {
    events: ManagerEvents;
    actions: ManagerActions;

    constructor(){
        this.events = new ManagerEvents(this)
        this.actions = new ManagerActions(this)
    }
}