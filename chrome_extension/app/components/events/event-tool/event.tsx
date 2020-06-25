import React, { Component } from 'react';
import styled from 'styled-components';
import { EventState } from '../../../store/reducers/event';

const Box = styled.div`
  background: white;
  height: 70px;
  width: 146px;
  border-radius: 20px;
  margin-right: 10px;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
`;

const CloseWindow = styled.div`
  width: 20px;
  height: 20px;
  z-index: 9999999;
  position: absolute;
  left: -10px;
  top: -10px;
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

interface EventComponentProps {
  deleteEvent: () => void;
}
class Event extends Component<EventState & EventComponentProps> {
  render() {
    const { picture, deleteEvent } = this.props;
    return (
      <Box>
        <CloseWindow onClick={deleteEvent} />
        <img style={{ objectFit: 'cover' }} src={picture} alt="" />
      </Box>
    );
  }
}

export default Event;
