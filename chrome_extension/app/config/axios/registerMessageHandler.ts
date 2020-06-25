import axios from 'axios';

export function registerMessageHandler() {
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.name === 'axiosMessagingAdapterRequest') {
      axios({
        baseURL: request.config.baseURL,
        url: request.config.url,
        method: request.config.method,
        data: JSON.parse(request.config.data),
        headers: { ...request.config.headers, ...(request.hash) ? { authentication: request.hash } : {} }
      })
                .then((response) => sendResponse({ response }))
                .catch((error) => {
                  sendResponse({ error });
                });

      return true;
    }

    return false;
  });
}
