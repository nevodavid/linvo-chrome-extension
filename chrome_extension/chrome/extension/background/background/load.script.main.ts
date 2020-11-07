export const loadScriptMain = (name: string, tabId: number, cb: () => any) => {
  if (process.env.NODE_ENV === 'production') {
    chrome.tabs.executeScript(
      tabId,
      { file: `/js/${name}.bundle.js`, runAt: 'document_end' },
      cb
    );
  } else {
    fetch(`http://localhost:4000/js/${name}.bundle.js`)
      .then((res) => res.text())
      .then((fetchRes) => {
        // Load redux-devtools-extension inject bundle,
        // because inject script and page is in a different context
        const request = new XMLHttpRequest();
        request.open(
          'GET',
          'chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd/js/redux-devtools-extension.js'
        ); // sync
        request.send();
        request.onload = () => {
          if (
            request.readyState === XMLHttpRequest.DONE &&
            request.status === 200
          ) {
            chrome.tabs.executeScript(tabId, {
              code: request.responseText,
              runAt: 'document_start',
            });
          }
        };

        chrome.tabs.executeScript(tabId, {
          code: fetchRes,
          runAt: 'document_end',
        });
      });
  }
};
