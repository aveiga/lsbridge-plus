declare enum Chanels {
    ALL = 0,
    OWNTAB = 1
}
interface Listener {
    callback: Function;
    chanel: Chanels;
}
export declare class LSBridge {
    id: String;
    listeners: Map<String, Array<Listener>>;
    constructor();
    send(topic: string, message: any, chanel?: Chanels): void;
    subscribe(topic: string, callback: Function, chanel?: Chanels): void;
    unsubscribe(topic: String, callback: Function, chanel?: Chanels): void;
    _uuidv4(): any;
}
export {};
