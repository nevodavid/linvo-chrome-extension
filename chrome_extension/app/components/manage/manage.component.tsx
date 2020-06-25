import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { UlList } from '../events/events.list.component';
import { EventsActions } from '../../store/actions/event';
import { EventsService } from '../../services/events.service';

interface ManageComponentProps {
  deleteEventGroup: (id: string, url: string) => Promise<any>;
}
interface ManageComponentState {
  hits: number,
  views: number;
}
class ManageComponent extends Component<ManageComponentProps, ManageComponentState> {
  state: ManageComponentState = {
    hits: 0,
    views: 0
  };

  componentDidMount(): void {
    this.loadHitsAndViews();
  }

  goBack = () => {
    const {
      // @ts-ignore
      history: {
        // @ts-ignore
        push
      } } = this.props;
    push('/');
  }

  delete = async () => {
    const { deleteEventGroup,
      // @ts-ignore
      match: {
        params: {
          domain,
          id
        }
      } } = this.props;

    await deleteEventGroup(id, domain);
    this.goBack();
  }

  loadHitsAndViews = async () => {
    const {
      // @ts-ignore
      match: {
        params: {
          id
        }
      } } = this.props;
    const { views, hits } = await EventsService.getGroupById(id);
    this.setState({
      views,
      hits
    });
  }

  render() {
    const { views, hits } = this.state;
    return (
      <UlList>
        <li style={{ listStyle: 'none', fontSize: 15 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#ffce00' }}>Back to interactions list</Link></li>
        <li>Views: {views}</li>
        <li>Hits: {hits}</li>
        <li onClick={this.delete} style={{ cursor: 'pointer', listStyle: 'none', fontSize: 15, color: 'red', marginTop: 20 }}>Delete interaction</li>
      </UlList>
    );
  }
}

export default connect(() => ({}), (dispatch) => ({
  // eslint-disable-next-line new-cap
  deleteEventGroup: (id: string, url: string) => dispatch(EventsActions.deleteGroup(id, url))
}))(ManageComponent);
