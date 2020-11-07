import { backgroundListen } from '../inject';

export const injectUser = async (userObject: any, tab: number) => {
  backgroundListen.emit(tab, 'user', userObject);
};

export const injectUserAfterLoad = async (tab: number) => {
  const val: { user?: string } = await new Promise((res) => {
    chrome.storage.local.get('user', (value) => {
      res(value);
    });
  });

  if (val.user) {
    return injectUser(val.user, tab);
  }
  return true;
};
