var Chanels;
(function (Chanels) {
    Chanels[Chanels["ALL"] = 0] = "ALL";
    Chanels[Chanels["OWNTAB"] = 1] = "OWNTAB";
})(Chanels || (Chanels = {}));
export class LSBridge {
    constructor() {
        this.id = this._uuidv4();
        this.listeners = new Map();
        window.addEventListener("storage", (e) => {
            let eventTopic = e.key || "";
            let eventPayload = JSON.parse(e.newValue || "");
            let topicListeners = this.listeners.get(eventTopic) || [];
            topicListeners.forEach(listener => {
                if (listener.chanel === eventPayload.chanel) {
                    listener.callback(eventPayload.message);
                }
            });
        });
    }
    send(topic, message, chanel = Chanels.ALL) {
        if (chanel === Chanels.ALL) {
            let dataToStore = {
                message: message,
                chanel: chanel
            };
            localStorage.setItem(topic, JSON.stringify(dataToStore));
        }
        else if (chanel === Chanels.OWNTAB) {
        }
    }
    subscribe(topic, callback, chanel = Chanels.ALL) {
        if (!this.listeners.get(topic)) {
            this.listeners.set(topic, []);
        }
        let listener = {
            callback: callback,
            chanel: chanel
        };
        let newTopicListeners = this.listeners.get(topic) || [];
        newTopicListeners.push(listener);
        // if(chanel === Chanels.ALL) {
        //   window.addEventListener("storage", (e) => {
        //     if(e.key === topic) {
        //       callback(e.newValue);
        //     }
        //   });
        // } else if(chanel === Chanels.OWNTAB) {
        // }
    }
    unsubscribe(topic, callback, chanel = Chanels.ALL) {
        let topicListeners = this.listeners.get(topic);
        topicListeners.map(tl => {
            if (JSON.stringify(callback) === JSON.stringify(tl.callback) &&
                chanel === tl.chanel) {
                return null;
            }
        });
        topicListeners = topicListeners.filter(tl => tl !== null);
    }
    _uuidv4() {
        //@ts-ignore
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
    }
}
//# sourceMappingURL=lsbridge.js.map