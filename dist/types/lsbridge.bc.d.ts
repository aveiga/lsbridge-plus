export declare enum Chanels {
    ALL = 0,
    OWNTAB = 1
}
interface Listener {
    callback: Function;
    chanel: Chanels;
}
interface BroadcasterReceiver {
    broadcaster: BroadcastChannel;
    receiver: BroadcastChannel;
}
export declare class LSBridge {
    id: string;
    broadcastChanels: Map<string, BroadcasterReceiver>;
    listeners: Map<String, Array<Listener>>;
    constructor();
    send(topic: string, message: any, chanel?: Chanels): void;
    subscribe(topic: string, callback: Function, chanel?: Chanels): void;
    unsubscribe(topic: String, callback: Function, chanel?: Chanels): void;
    _uuidv4(): any;
}
export {};
