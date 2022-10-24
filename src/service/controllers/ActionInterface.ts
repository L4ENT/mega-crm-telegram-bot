import ControllerInterFace from "@src/service/controllers/ControllerInterface";

export default interface ActionInterface {
    controller: ControllerInterFace;
    
    run(props: any): Promise<any>
}