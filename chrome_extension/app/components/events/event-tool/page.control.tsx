import React, {Component} from 'react';
import styled, {createGlobalStyle, StyleSheetManager} from 'styled-components';
import {connect} from 'react-redux';
import EventToolLayout from './event.tool.layout';
import {AppState} from '../../../store/reducers/app.state';
import {EventsActions, GetEvents} from '../../../store/actions/event';
import {EventGroupState, EventState} from '../../../store/reducers/event';
import Event from './event';
import widget, {Widget} from '../../../store/reducers/widget';
import {toast, ToastContainer} from "react-toastify";
import GlobalStyle from "../../globalStyles/plugin.global.style";
import InjectJs from "../inject";
import Frame, {FrameContextConsumer} from "react-frame-component";

const LeftBarComponent = styled.div`
  width: 100%;
  background: rgba(2,30,71,0.79);
  position: fixed;
  left: 0;
  bottom: 0;
  height: 100px;
  overflow: hidden;
  border-top: 2px solid white;
  overflow-y: auto;
  padding: 10px 10px;
  z-index: 9999999999;
`;

const AddEventDiv = styled.div`
  height: 70px;
  color: white;
  font-size: 30px;
  display: flex;
  align-items: center;
  cursor: pointer;
  text-shadow: 0px 0px 5px rgba(0,0,0,0.51);
`;

const CloseWindow = styled.div`
  width: 50px;
  height: 50px;
  z-index: 9999999;
  position: fixed;
  left: 10px;
  top: 10px;
  background: red;
  color: white;
  border-radius: 100px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:after {
    content: "X";
    font-size: 20px;
    color: white;
  }
`;

const Save = styled.div`
  margin-right: 20px;
  background: black;
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 20px;
  cursor: pointer;
`;

interface PageControlProps {
    eventGroup: EventGroupState;
    events: EventState[];
    user: number;
    widgets: Widget[],
    addEvent: (group_id: string, url: string, picture: string, match: string, order: number) => Promise<any>;
    closeEvent: (group_id: string) => Promise<any>;
    deleteEvent: (event_id: string, group_id: string) => Promise<any>;
    saveEventGroup: (groupId: string, groupName: string, events: Array<{ _id?: string, id: string, url: string, picture: string, match: string, order: number }>, widget?: Widget) => Promise<any>;
    updateWidget: (group_id: string, widget: Widget) => void;
    updateGroupName: (group_id: string, groupName: string) => void;
    injectToTest: boolean;
}

const Select = styled.select`
  background: white;
  font-size: 30px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align-last:center;
  padding: 10px;
  text-align: center;
  margin-right: 10px;
`;

const Input = styled.input`
  background: white;
  font-size: 30px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align-last:center;
  height: 62px !important;
  width: 200px !important;
  margin: 0 !important;
  text-align: center;
  margin-right: 10px !important;
`;

class PageControl extends Component<PageControlProps> {
    add = () => {
        const {addEvent, eventGroup, events} = this.props;
        // eslint-disable-next-line new-cap
        EventToolLayout.Activate((pageLocation, path, image) => {
            const order = events.reduce((all, current) => current.order > all ? current.order : all, 0);
            addEvent(eventGroup.id, pageLocation, image, path, order + 1);
        });
    };

    deleteEvent = (eventId: string) => async () => {
        const {eventGroup, deleteEvent} = this.props;
        await deleteEvent(eventId, eventGroup.id);
        this.forceUpdate();
    };

    close = async () => {
        const {closeEvent, eventGroup} = this.props;
        await closeEvent(eventGroup.id);
    };

    save = async () => {
        const {saveEventGroup, events, eventGroup} = this.props;
        await saveEventGroup(eventGroup.id, eventGroup.groupName, events, {
            ...eventGroup.widget,
            domain: window.location.hostname
        });
        toast.success("Saved Successfully")
    };

    selectWidget = (event: any) => {
        const {widgets, eventGroup, updateWidget} = this.props;
        const widget = widgets.find(f => f.id === event.target.value);

        updateWidget(eventGroup.id, widget);
    }

    changeGroup = (event: any) => {
        const {updateGroupName, eventGroup} = this.props;
        updateGroupName(eventGroup.id, event.target.value);
    }

    render() {
        const {injectToTest, events, eventGroup, widgets, user} = this.props;
        return (
            <div>
                {injectToTest && user && (
                    <InjectJs id={user} />
                )}
                {!eventGroup || !user || !eventGroup.eventToolOpen ? <div/> : (
                    <>
                        <EventToolLayout/>
                        <CloseWindow onClick={this.close}/>
                        <LeftBarComponent>
                            <Frame style={{width: '100%', height: '100%', border: 0}}>
                                <FrameContextConsumer>
                                    {
                                        frameContext => (
                                            <StyleSheetManager target={frameContext.document.head}>
                                                <div style={{fontFamily: 'arial', display: 'flex', flexDirection: 'row'}}>
                                                    <div style={{display: 'flex', flexDirection: 'row', flex: 1}}>
                                                        {events.map(e => (
                                                            <Event
                                                                deleteEvent={this.deleteEvent(e.id)} {...e}>{e.url}</Event>
                                                        ))}
                                                        <AddEventDiv onClick={this.add}>+ ADD EVENT</AddEventDiv>
                                                    </div>
                                                    <Input onFocus={e => e.target.select()} onChange={this.changeGroup} style={{fontSize: 30}}
                                                           value={eventGroup.groupName} type="text"/>
                                                    <Select onChange={this.selectWidget}>
                                                        <option value="">Select widget</option>
                                                        {(widgets || []).map(widget => (
                                                            // eslint-disable-next-line no-underscore-dangle
                                                            <option value={widget.id}
                                                                    selected={widget.id === eventGroup?.widget?.id}>{widget.title}</option>
                                                        ))}
                                                    </Select>
                                                    <Save onClick={this.save}>Save</Save>
                                                </div>
                                            </StyleSheetManager>
                                        )
                                    }
                                </FrameContextConsumer>
                            </Frame>
                        </LeftBarComponent>
                        <ToastContainer/>
                        <GlobalStyle/>
                    </>
                )}
            </div>
        )
    }
}

// eslint-disable-next-line new-cap
export default connect((app: AppState) => ({
    user: app.user.id,
    injectToTest: app.user.injectToTest,
    widgets: app.widgets[window.location.hostname],
    events: GetEvents(app).events,
    eventGroup: GetEvents(app)
}), (dispatch) => ({
    // eslint-disable-next-line camelcase
    addEvent: (group_id: string, url: string, picture: string, match: string, order: number) => dispatch(EventsActions.addEventToEventGroup(group_id, url, picture, match, order)),
    // eslint-disable-next-line camelcase
    closeEvent: (group_id: string) => dispatch(EventsActions.closeEventGroup(group_id)),
    // eslint-disable-next-line no-underscore-dangle,camelcase
    updateGroupName: (group_id: string, groupName: string) => dispatch(EventsActions._updateGroupName({
        id: group_id,
        groupName,
        domain: window.location.hostname
    })),
    // eslint-disable-next-line no-underscore-dangle,camelcase
    updateWidget: (group_id: string, widget: Widget) => dispatch(EventsActions._updateWidget({
        widget,
        group_id,
        domain: window.location.hostname
    })),
    // eslint-disable-next-line camelcase
    deleteEvent: (event_id: string, group_id: string) => dispatch(EventsActions.deleteEvent(group_id, event_id)),
    saveEventGroup: (groupId: string, groupName: string, events: Array<{ _id: string, id: string, url: string, picture: string, match: string, order: number }>, widget?: Widget) => dispatch(EventsActions.saveEventGroup(groupId, groupName, events, window.location.host, widget)),
}))(PageControl);
