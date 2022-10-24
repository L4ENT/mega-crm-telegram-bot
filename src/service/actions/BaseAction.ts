import ActionInterface from "@src/service/controllers/ActionInterface";
import ControllerInterface from "@src/service/controllers/ControllerInterface";

export default class BaseAction implements ActionInterface {
    controller: ControllerInterface;
    
    constructor(constroller: ControllerInterface) {
        this.controller = constroller
    }

    run(props: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

}