import { EventEmitter } from "events";

export const injectListenWrapper = () => {
  const eventEmitterInject = new EventEmitter();
  const emitStack = {} as any;
  // @ts-ignore
  window.emitter = (name, value) => {
    emitStack[name] = emitStack[name] || [];
    emitStack[name].push(value);
    eventEmitterInject.emit(name, value);
  };

  // @ts-ignore
  if (window.pusher && window.pusher.length) {
      // @ts-ignore
      window.pusher.forEach((push: any) => {
          // @ts-ignore
          window.emitter(push[0], push[1]);
      });

      // @ts-ignore
      window.pusher = [];
  }

  return class InjectListen {
    static addListener = (name: string, value: (...params: any[]) => void) => {
      if (emitStack[name] && emitStack[name].length) {
        emitStack[name].forEach((val: any) => {
          value(val);
        });
        emitStack[name] = [];
      }
      eventEmitterInject.addListener(name, value);
    };
   static emit = (todo: string, body: any) => {
      chrome.runtime.sendMessage({ todo, body });
    };
  };
};

export const backgroundListenWrapper = () => {
  const eventEmitterBackground = new EventEmitter();
  chrome.runtime.onMessage.addListener((message, sender, response) => {
    eventEmitterBackground.emit(message.todo, message.body);
  });

  return class BackgroundListen {
    static addListener = (name: string, value: (...params: any[]) => void) => {
      eventEmitterBackground.on(name, value);
    };

    static emit = (tabId: number, name: string, body: any) => {
      const emitterFunction = `
      if (window.emitter) {
        window.emitter('${name}', ${JSON.stringify(body)});
      }
      else {
        window.pusher = window.pusher || [];
        window.pusher.push(['${name}', ${JSON.stringify(body)}]);
      }
      `;

      chrome.tabs.executeScript(tabId, {
        code: emitterFunction,
        runAt: "document_start",
      });
    };
  };
};
