import AgentWithIdInterface from "@src/agents/AgentWithIdInterface";
import BotAgent from "@src/agents/bot/BotAgent";
import { telegramBotAgent } from "@src/agents/bot/di";
import DispatcherActions from "@src/agents/dispatcher/actions/DispatcherActions";
import DispatcherEvents from "@src/agents/dispatcher/events/DispatcherEvents";

export default class DispatcherAgent implements AgentWithIdInterface{
  events: DispatcherEvents;
  actions: DispatcherActions;
  bot: BotAgent
  identity: any

  constructor(identity: any) {
    this.events = new DispatcherEvents(this);
    this.actions = new DispatcherActions(this);
    this.identity = identity
    this.bot = telegramBotAgent
  }
}
