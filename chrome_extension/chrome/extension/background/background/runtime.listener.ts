import { EventEmitter } from 'events';

export const emitter = new EventEmitter();

export const runTimeListener = () => {
  chrome.runtime.onMessage.addListener((message, send, sendResponse) => {
    switch (message.todo) {
      case 'request': {
        (async () => {
          const val: { hash?: string } = await new Promise((res) => {
            chrome.storage.local.get('hash', (value) => {
              res(value);
            });
          });

          sendResponse(
            await (
              await fetch(message.url, {
                ...message.options,
                headers: {
                  ...message.options.headers,
                  ...(val.hash ? { hash: val.hash } : {}),
                },
              })
            ).json()
          );
        })();
        return true;
      }
      default: {
        return false;
      }
    }
  });
};
