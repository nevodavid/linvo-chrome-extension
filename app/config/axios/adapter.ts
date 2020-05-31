import { AxiosRequestConfig, AxiosPromise } from 'axios';

export function adapter(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('state', (obj) => {
      const { state } = obj;
      const initialState = JSON.parse(state || '{}');

      const messageConfig = {
        name: 'axiosMessagingAdapterRequest',
        config: config,
        hash: initialState?.user?.hash
      };

      chrome.runtime.sendMessage(messageConfig, (message) => {
        // there was an error with the chrome messaging API
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }

        // the request errored
        if (message.error) {
          reject(message.error);
        }

        resolve(message.response);
      });
    });
  });
}
