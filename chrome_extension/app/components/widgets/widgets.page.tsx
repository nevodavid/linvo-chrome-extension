import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { v1 as uuidv1 } from 'uuid';
import { UlList } from '../events/events.list.component';
import { AppState } from '../../store/reducers/app.state';
import { getUrl } from '../../store/actions/event';
import { WidgetState } from '../../store/reducers/widget';
import { AddWidget, WidgetsActions } from '../../store/actions/widgets';

interface WidgetsPagePropsInterface {
  widgets: WidgetState;
  addWidget: (payload: Omit<AddWidget, 'domain'>, domain: string) => Promise<any>;
}

interface WidgetsPageStateInterface {
  url: string;
}
class WidgetsPage extends Component<WidgetsPagePropsInterface, WidgetsPageStateInterface> {
  state: WidgetsPageStateInterface = {
    url: ''
  };

  componentDidMount(): void {
    this.setList();
  }

  // eslint-disable-next-line react/sort-comp
  reloadComponent = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tab) => {
      chrome.tabs.executeScript(tab[0].id, { code: 'window.reloadStore()' });
    });
  }

  setList = async () => {
    const url = await getUrl();

    this.setState({
      url
    });
  }

  addWidget = async () => {
    const { addWidget } = this.props;
    const { url } = this.state;
    const id = uuidv1();
    await addWidget({
      id,
      text: '',
      type: 'popup',
      title: ''
    }, url);

    this.gotoEdit(id)();
    this.reloadComponent();
  }

  gotoEdit = (id: string) => () => {
    const { url } = this.state;
    const {
      // @ts-ignore
      history: {
        // @ts-ignore
        push
      } } = this.props;
    push(`/widgets/manage/${url}/${id}`);
  }

  render() {
    const { url } = this.state;
    const { widgets } = this.props;
    return (
      <UlList>
        <li style={{ listStyle: 'none', cursor: 'pointer' }}>
          <Link to="/" style={{ cursor: 'pointer', textDecoration: 'none', color: '#ffce00', fontSize: 15, marginBottom: 10 }}>{'<'} BACK TO EVENTS LIST</Link>
        </li>
        {url && <li onClick={this.addWidget} style={{ listStyle: 'none', cursor: 'pointer' }}>ADD WIDGET</li>}
        <li style={{ listStyle: 'none', fontSize: 12, marginTop: 30 }}>WIDGETS LIST:</li>
        {url && (widgets[url] || []).map(widget => (
          <li onClick={this.gotoEdit(widget.id)} style={{ cursor: 'pointer' }}>
            {widget.title || 'Unnamed'}
          </li>
        ))}
      </UlList>
    );
  }
}

export default connect((app: AppState) => ({ widgets: app.widgets }), (dispatch) => ({
  // eslint-disable-next-line new-cap
  addWidget: (payload: Omit<AddWidget, 'domain'>, domain = '') => dispatch(WidgetsActions.AddWidget(payload, domain))
}))(WidgetsPage);
