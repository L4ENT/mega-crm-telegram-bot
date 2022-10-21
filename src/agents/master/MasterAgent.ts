import AgentWithIdInterface from "@src/agents/AgentWithIdInterface";
import BotAgent from "@src/agents/bot/BotAgent";
import { telegramBotAgent } from "@src/agents/bot/di";
import MasterActions from "@src/agents/master/actions/MasterActions";
import MasterEvents from "@src/agents/master/events/MasterEvents";

class MasterAgent implements AgentWithIdInterface { 
  events: MasterEvents;
  actions: MasterActions;
  identity: any;
  bot: BotAgent;

  constructor(identity: any) {
    this.identity = identity;
    this.events = new MasterEvents(this);
    this.actions = new MasterActions(this);
    this.bot = telegramBotAgent;
  }
}

export default MasterAgent