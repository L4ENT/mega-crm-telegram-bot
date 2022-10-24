import BaseFlow from "@src/apps/telegram/flows/BaseFlow";
import FlowInterface from "@src/apps/telegram/flows/FlowInterFace";

export default class ChangeMasterFlow extends BaseFlow {
  static key: string;
  data: {
    orderId: number;
  };

  constructor(orderId: number) {
    super();
    this.key = ChangeMasterFlow.getKey();
    this.data = {
      orderId,
    };
  }

  static getKey(): string {
      return "order:changemaster"
  }
}
