import BaseAction from "@src/service/actions/BaseAction";

export default interface ControllerInterFace {
    name:string
    actions: { [key: string]: typeof BaseAction; }
    isme(controller:  string): boolean
}