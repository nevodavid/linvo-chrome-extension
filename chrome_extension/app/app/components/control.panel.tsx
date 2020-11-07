import React, { Component } from 'react';
import { createGlobalStyle } from 'styled-components';
import Loader from 'react-loader-spinner';
import { config } from '../../config/config';
import Tab = chrome.tabs.Tab;

const GlobalStyle = createGlobalStyle`
  body {
    width: 350px
  }
`;
interface ControlPanelState {
  loader: boolean;
}
class ControlPanel extends Component<{}, ControlPanelState> {
  state = {
    loader: false
  }

  goToControlPanel = () => {
    chrome.tabs.create({ url: config.control_panel_url });
  }

  fetchToken = () => {
    chrome.cookies.get({ url: 'https://www.linkedin.com', name: 'li_at' }, async (cookie) => {
      if (!cookie) {
        alert('Please login into Linkedin and then try again');
        return ;
      }
      this.setState({
        loader: true
      });
      const value = await fetch(`${config.api_url}/login`, { method: 'post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: cookie.value }) });
      const json = await value.json();

      chrome.runtime.sendMessage({
        todo: 'update_token',
        body: {
          hash: json.hash,
          user: json.user
        }
      });

      const activeTab: Tab|null = await new Promise(res => {
        chrome.tabs.query({}, (results) => {
          return res(results.find(t => t.url.indexOf(config.control_panel_url) > -1));
        });
      });

      if (activeTab) {
        chrome.tabs.update(activeTab.id, {url: config.control_panel_url + '?hash=' + json.hash, active: true});
      }
      else {
        chrome.tabs.create({url: config.control_panel_url + '?hash=' + json.hash});
      }
      localStorage.setItem('login', 'true');
      this.setState({
        loader: false
      });
    });
  }

  render() {
    const login = localStorage.getItem('login');
    const { loader } = this.state;
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ padding: 20 }}>
          <GlobalStyle />
          {!loader && (<div style={{ textAlign: 'center', marginBottom: 30, color: '#7367f0', cursor: 'pointer', fontSize: 20, fontWeight: 'bold' }} onClick={this.goToControlPanel}>
            {login && 'Go to control panel'}
          </div>)}

          {!loader && (<div style={{ textAlign: 'center', color: '#7367f0', cursor: 'pointer', fontSize: 20, fontWeight: 'bold' }} onClick={this.fetchToken}>
            {!login ? 'Login to control panel' : 'Update token and login'}
          </div>)}
          {loader && <Loader color="#7367f0" type="Oval" width={100} height={100} />}
        </div>
      </div>
    );
  }
}

export default ControlPanel;
