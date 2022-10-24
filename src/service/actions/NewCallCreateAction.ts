import CallDto from "@src/dto/CallDto";
import BaseAction from "@src/service/actions/BaseAction";

export default class NewCallCreateAction extends BaseAction {
    async run(props: any): Promise<any> {
        const callDto: CallDto = props.callDto
    }
}