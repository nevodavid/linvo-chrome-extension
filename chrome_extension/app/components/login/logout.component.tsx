import React, {Component} from 'react';
import {connect} from 'react-redux';
import {AppState} from '../../store/reducers/app.state';
import {UserActions} from "../../store/actions/user";
import styled from "styled-components";
import {ConnectPlugin} from "../../containers/App";

interface LogoutComponentProps {
    logged: boolean;
    userId: number;
    logout: () => void;
    injectToTest: boolean;
    changeInjection: () => Promise<void>;
}

const LogoutComponentStyle = styled.div`
  color: #ffce00;
  font-size: 10px;
  cursor: pointer;
  margin-top: 10px;
`

interface LogoutComponentState {
    didScriptFound: boolean | undefined;
}

class LogoutComponent extends Component<LogoutComponentProps, LogoutComponentState> {
    state: LogoutComponentState = {
        didScriptFound: undefined
    }

    reloadComponent = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tab) => {
            chrome.tabs.executeScript(tab[0].id, { code: 'window.reloadStore()' });
        });
    }

    connect = () => {
        const {userId} = this.props;
        chrome.tabs.query({active: true, currentWindow: true}, async (tab) => {
            chrome.tabs.executeScript(tab[0].id, {code: `window.connectToPlugin('${userId}')`});
            window.close();
        });
    }

    componentDidMount(): void {
        this.isSiteConnected();
    }

    logout = () => {
        const {logout} = this.props;
        logout();
        setTimeout(() => {
            this.reloadComponent();
        });
    }

    // eslint-disable-next-line react/sort-comp
    findIfScriptEnabled = (): Promise<boolean> => new Promise((outerRes) => {
        const {userId} = this.props;
        chrome.tabs.query({active: true, currentWindow: true}, async (tab) => {
            chrome.tabs.executeScript(tab[0].id, {code: 'document.all[0].outerHTML'}, (res) => {
                const match = res[0].match(/window\.linvoApiKey.*=.*'(.*)'/);
                if (!match || !match.length || !match[1]) {
                    outerRes(false);
                    return;
                }

                outerRes(Number(match[1]) === Number(userId));
            });
        });
    });

    isSiteConnected = () => {
        const {userId} = this.props;

        if (!userId) {
            return;
        }

        (async () => {
            const didScriptFound: boolean = await this.findIfScriptEnabled();
            this.setState({
                didScriptFound
            });
        })();
    }

    inject = async () => {
        const {changeInjection} = this.props;
        await changeInjection();
        chrome.tabs.query({active: true, currentWindow: true}, async (tab) => {
            chrome.tabs.executeScript(tab[0].id, {code: `window.location.reload();`});
            this.forceUpdate();
        });
    }


    render() {
        const {logged, injectToTest} = this.props;
        const {didScriptFound} = this.state;
        return !logged ? <></> : (
            <>
                {injectToTest && <div style={{color: 'yellow', fontSize: 10}}>WEBSITE IN DEMO</div>}
                {didScriptFound === false && !injectToTest && <div style={{color: 'red', fontSize: 10}}>WEBSITE NOT CONNECTED</div>}
                {didScriptFound === true && !injectToTest && <div style={{color: 'green', fontSize: 10}}>WEBSITE CONNECTED</div>}
                <div style={{marginTop: 10, color: '#ffce00'}}>
                    <input onClick={this.inject} checked={injectToTest === true} type="checkbox" />Show demo
                </div>
                <LogoutComponentStyle onClick={this.logout}>LOGOUT</LogoutComponentStyle>
                <ConnectPlugin onClick={this.connect}>CONNECT PLUGIN</ConnectPlugin>
            </>
        );
    }
}

export default connect((app: AppState) => ({
    userId: app.user.id,
    logged: Boolean(app.user.id),
    injectToTest: app.user.injectToTest
}), (dispatch) => ({
    logout: () => dispatch(UserActions.removeUser()),
    changeInjection: () => dispatch(UserActions.changeInject()),
}))(LogoutComponent);
