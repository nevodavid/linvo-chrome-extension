import React, { Component } from 'react';
import { lookForProfile } from './components/send.message/look.for.my.profile';
import {LinkedinFetch} from "./components/filtering/linkedin.fetch";
import {config} from "../config/config";
import {throttle} from 'lodash';
import ResizeObserver from 'resize-observer-polyfill';
import {AppendComponent} from "../global.components/append.component";
import Helper from "./components/helper/helper";
import {batchListener} from "./components/batch/batch.listener";
import {Modal} from "../global.components/modal.component";
import swal from 'sweetalert';
import {injectListenWrapper} from "../../chrome/extension/background/background/pub.sub";
import {UserReducerState} from "./store/reducers/user.reducer";
import store from "./store/configure.store";
import {USER_ACTION} from "./store/actions/user.action";

export const injectListen = injectListenWrapper();

export let categories: any[];
// @ts-ignore
export const getStyles = window.getStyles()

export const sendRequest: any = (url: RequestInfo, options: RequestInit) => {
  return new Promise((res) => {
    chrome.runtime.sendMessage({
      todo: 'request',
      url,
      options
    }, (r) => res(r));
  });
}

class Background extends Component {
  listenThrottle: any;
  observer: ResizeObserver;
  observer2: MutationObserver;

  constructor(props: any) {
    super(props);
    this.listenThrottle = throttle(this.addAllListeners, 2000, {
      leading: true
    });
  }

  componentDidMount() {
    injectListen.addListener('user', (value: UserReducerState) => {
      // store.dispatch(USER_ACTION.updateUser(value));
    });

    AppendComponent.add({
      appendTo: document.querySelector('html'),
      component: <Helper />
    });

    AppendComponent.add({
      identifier: 'linvo-modal',
      appendTo: document.querySelector('html'),
      component: <Modal />
    })

    this.observer2 = new MutationObserver(this.listenThrottle);
    this.observer = new ResizeObserver(this.listenThrottle);
    window.addEventListener('scroll', this.listenThrottle);

    this.observer.observe(document.body);
    this.observer2.observe(document.body, { attributes: true, childList: true, subtree: true });

    (async () => {
      categories = await sendRequest(`${config.api_url}/login/categories`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' }
      });
    })();
  }

  addAllListeners = () => {
    console.log('change size');
    lookForProfile();
    batchListener();
    // LinkedinFetch.addFilterComponent();
    // LinkedinFetch.newComponent();
    // LinkedinFetch.updateValues();
  }

  componentWillUnmount() {
    this.observer.disconnect();
    this.observer2.disconnect();
    window.removeEventListener('scroll', this.listenThrottle);
  }

  render() {
    return (
        <></>
    );
  }
}

export default Background;
