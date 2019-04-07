export enum Chanels {
  ALL,
  OWNTAB
}

interface Listener {
  callback: Function;
  chanel: Chanels;
}

interface DataMessage {
  message: any;
  chanel: Chanels;
  ownerId: string;
}

interface BroadcasterReceiver {
  broadcaster: BroadcastChannel;
  receiver: BroadcastChannel;
}

export class LSBridge {
  id: string;
  broadcastChanels: Map<string, BroadcasterReceiver>;
  listeners: Map<String, Array<Listener>>;

  constructor() {
    this.id = this._uuidv4();
    this.listeners = new Map();
    this.broadcastChanels = new Map();
  }

  send(topic: string, message: any, chanel: Chanels = Chanels.ALL) {
    let dataToStore: DataMessage = {
      message: message,
      chanel: chanel,
      ownerId: this.id
    };

    let bc = this.broadcastChanels.get(topic);

    if (bc) {
      bc.broadcaster.postMessage(dataToStore);
    }
  }

  subscribe(topic: string, callback: Function, chanel: Chanels = Chanels.ALL) {
    if (!this.broadcastChanels.get(topic)) {
      let broadcaster = new BroadcastChannel(topic);
      let receiver = new BroadcastChannel(topic);
      receiver.onmessage = (e: MessageEvent) => {
        let message: DataMessage = e.data;
        //@ts-ignore
        let topic = e.target.name;

        (this.listeners.get(topic) || []).forEach((l: Listener) => {
          if (message.chanel === Chanels.ALL) {
            l.callback(message.message);
          } else if (
            message.chanel === Chanels.OWNTAB &&
            message.ownerId === this.id
          ) {
            l.callback(message.message);
          }
        });
      };

      this.broadcastChanels.set(topic, {
        broadcaster: broadcaster,
        receiver: receiver
      });
    }

    if (!this.listeners.get(topic)) {
      this.listeners.set(topic, []);
    }

    let topicListeners = this.listeners.get(topic);
    let listener: Listener = {
      callback: callback,
      chanel: chanel
    };
    topicListeners.push(listener);
  }

  unsubscribe(
    topic: String,
    callback: Function,
    chanel: Chanels = Chanels.ALL
  ) {
    if (!callback) {
      this.listeners.delete(topic);
      return;
    }

    let topicListeners = this.listeners.get(topic);
    let nullListener = {
      callback: null,
      chanel: null
    };

    topicListeners = topicListeners.map(tl => {
      if (callback === tl.callback && chanel === tl.chanel) {
        return nullListener;
      } else {
        return tl;
      }
    });
    topicListeners = topicListeners.filter(
      tl => JSON.stringify(tl) !== JSON.stringify(nullListener)
    );

    this.listeners.set(topic, topicListeners);
  }

  _uuidv4() {
    //@ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
}
