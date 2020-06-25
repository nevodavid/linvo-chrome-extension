import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { EventsActions, getHtml, getUrl } from '../../store/actions/event';
import { AppState } from '../../store/reducers/app.state';
import { EventGroupState, EventsState } from '../../store/reducers/event';
import { Link } from 'react-router-dom';

export const UlList = styled.ul`
  color: #ffce00;
  padding: 0;
  margin: 0;
  margin-top: 10px;
  margin-left: 30px;
  flex: 1;
  font-size: 20px;
  li {
    margin-bottom: 10px; 
  }
`;

interface LoggedProps {
    createNewEvent: (url: string) => Promise<any>;
    events: EventsState;
    openEventGroup: (group_id: string, url: string) => Promise<any>;
}

interface LoggedListState {
  list: EventGroupState[],
  url: string;
  didScriptFound: boolean;
}
class EventsList extends Component<LoggedProps, LoggedListState> {
  state: LoggedListState = {
    list: [],
    url: '',
    didScriptFound: false
  };

  componentDidMount(): void {
    this.setList();
  }

  setList = async () => {
    const url = await getUrl();

    const { events } = this.props;

    this.setState({
      list: (events[url] || []),
      url
    });
  }

  reloadComponent = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tab) => {
      chrome.tabs.executeScript(tab[0].id, { code: 'window.reloadStore()' });
      window.close();
    });
  }

  showPage = async () => {
    const { createNewEvent } = this.props;
    const { url } = this.state;
    await createNewEvent(url);
    this.reloadComponent();
  };

  showEvent = (eventId: string) => () => {
    const { openEventGroup } = this.props;
    const { url } = this.state;
    openEventGroup(eventId, url);
    this.reloadComponent();
  };

  render() {
    const { list, url } = this.state;
    return (
      <UlList>
        <li style={{ listStyle: 'none', cursor: 'pointer' }} onClick={this.showPage}>CREATE A NEW INTERACTION</li>
        <li style={{ listStyle: 'none' }}>
          <Link to="/widgets" style={{ textDecoration: 'none', color: '#ffce00' }}>WIDGETS LIST</Link>
        </li>
        <li style={{ listStyle: 'none', fontSize: 12, marginTop: 30 }}>INTERACTION LIST:</li>
        {list.map(event => (
          <li style={{ cursor: 'pointer' }} onClick={this.showEvent(event.id)} key={event.id}>{event.groupName} - {event.isSyncedWithServer ? 'Saved' : 'Not saved'} - <Link onClick={e => { e.stopPropagation(); }} to={`/manage/${url}/${event.id}`}>Manage</Link></li>
        ))}
      </UlList>
    );
  }
}

export default connect((app: AppState) => ({ events: app.event }), (dispatch) => ({
  createNewEvent: (url: string) => dispatch(EventsActions.createNewEvent(url)),
  openEventGroup: (group_id: string, url: string) => dispatch(EventsActions.openEventGroup(group_id, url)),
}))(EventsList);
