import ActionInterface from "@src/service/controllers/ActionInterface";
import BaseAction from "@src/service/actions/BaseAction";
import ControllerInterFace from "@src/service/controllers/ControllerInterface";

export default class BaseController implements ControllerInterFace {
    name:string;
    
    actions: { [key: string]: typeof BaseAction; };

    isme(controller:  string): boolean {
        return this.name === controller
    }

    async runAction(name: string, props: any) {
        const ActionClass = this.actions[name]
        const action  = new ActionClass(this)
        await action.run(props)
    }
    
}