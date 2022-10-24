import FlowInterface from "@src/apps/telegram/flows/FlowInterFace";

export default class BaseFlow implements FlowInterface{
    key: string;
    data: any;

    static getKey(): string {
        throw new Error("Method not implemented.");
    }
}