import AgentInterface from "@src/agents/AgentInterface";
import BotActions from "@src/agents/bot/actions/BotActions";
import MessagerEngineInterface from "@src/agents/bot/engines/MessagerEngineInterface";
import BotEvents from "@src/agents/bot/events/BotEvents";

class BotAgent implements AgentInterface {
  messagerEngine: MessagerEngineInterface;
  events: BotEvents;
  actions: BotActions;

  constructor(messagerEngine: MessagerEngineInterface) {
    this.messagerEngine = messagerEngine;
    this.events = new BotEvents(this);
    this.actions = new BotActions(this);
  }
}

export default BotAgent;
