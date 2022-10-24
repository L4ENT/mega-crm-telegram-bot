import BaseFlow from "@src/apps/telegram/flows/BaseFlow";

export default class AssignMasterFlow extends BaseFlow {
  key: string;
  data: {
    orderId: number;
  };
  
  constructor(orderId: number) {
    super();
    this.key = AssignMasterFlow.getKey();
    this.data = { orderId };
  }

  static getKey(): string {
      return "order:assignmaster"
  }
}
