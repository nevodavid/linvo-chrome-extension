import { registerMessageHandler } from '../../../app/config/axios/registerMessageHandler';
import { loadStyle } from './background/load.style';
import { loadScriptMain } from './background/load.script.main';
import { emitter, runTimeListener } from './background/runtime.listener';
import { injectUser, injectUserAfterLoad } from './background/inject.user';
import { backgroundListenWrapper } from './background/pub.sub';

export const backgroundListen = backgroundListenWrapper();

// @ts-ignore
function isInjected(tabId) {
  // @ts-ignore
  return chrome.tabs.executeScriptAsync(tabId, {
    code: `var injected = window.reactExampleInjected;
      window.reactExampleInjected = true;
      injected;`,
    runAt: 'document_start',
  });
}

registerMessageHandler();
runTimeListener();

// @ts-ignore
export function loadScript(name, tabId, cb): Promise<any> {
  (async () => {
    backgroundListen.addListener('update_token', (message: any) => {
      chrome.storage.local.set({ hash: message.hash, user: message.user });
      backgroundListen.emit(tabId, 'user', message.user);
    });
    // dev: async fetch bundle
    await loadStyle(tabId);
    await injectUserAfterLoad(tabId);
    await loadScriptMain(name, tabId, cb);
  })();
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'loading') return;
  if (tab.url.indexOf('linkedin.com') === -1) {
    return;
  }

  const result = await isInjected(tabId);
  if (chrome.runtime.lastError || result[0]) return;

  loadScript('inject', tabId, () => console.log('load inject bundle success!'));
});
