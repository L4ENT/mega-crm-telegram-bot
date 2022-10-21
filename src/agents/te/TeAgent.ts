import TeActions from "@src/agents/te/actions/TeActions";
import TeEvents from "@src/agents/te/events/TeEvents";

export default class TeAgent {
    events: TeEvents;
    actions: TeActions;

    constructor() {
        this.events = new TeEvents(this)
        this.actions = new TeActions(this)
    }   
}

