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


    render() {
        const {logged} = this.props;
        const {didScriptFound} = this.state;
        return !logged ? <></> : (
            <>
                {didScriptFound === false && <div style={{color: 'red', fontSize: 10}}>WEBSITE NOT CONNECTED</div>}
                {didScriptFound === true && <div style={{color: 'green', fontSize: 10}}>WEBSITE CONNECTED</div>}
                <LogoutComponentStyle onClick={this.logout}>LOGOUT</LogoutComponentStyle>
                <ConnectPlugin onClick={this.connect}>CONNECT PLUGIN</ConnectPlugin>
            </>
        );
    }
}

export default connect((app: AppState) => ({
    userId: app.user.id,
    logged: Boolean(app.user.id)
}), (dispatch) => ({
    logout: () => dispatch(UserActions.removeUser())
}))(LogoutComponent);
