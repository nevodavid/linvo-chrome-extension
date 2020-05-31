import React, { Component } from 'react';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import styled, { keyframes, StyleSheetManager } from 'styled-components';

const fadeInPopup = keyframes`
 0% { opacity: 0;}
 100% { opacity: 1 }
`;

const popupAnimation = keyframes`
 0% { margin-top: 100px;}
 100% { margin-top: 0 }
`;

const Wrapper = styled.div`
  width: 100% !important;
  height: 100% !important;
  position: fixed !important;
  left: 0 !important;
  top: 0 !important;
  z-index: 999999999 !important;
  background: rgba(0,0,0,0.25) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  animation-name: ${fadeInPopup} !important;
  animation-duration: 1s !important;
  animation-iteration-count: initial !important;
  
  iframe {
    border: 0 !important;
    width: 400px !important;
    height: 400px !important;
    animation-name: ${popupAnimation} !important;
    animation-duration: 1s !important;
    animation-iteration-count: initial !important;
  }
`;

const PopupContainer = styled.div`
  background: white;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  font-size: 20px;
  font-family: arial;
`;

interface PopupComponentProps {
    text: string;
    close?: () => void;
}

class PopupComponent extends Component<PopupComponentProps> {
  removeAll = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };

  render() {
    const { text, close } = this.props;
    return (
      <Wrapper onClick={close}>
        <Frame onClick={this.removeAll}>
          <FrameContextConsumer>
            {
                            frameContext => (
                              <StyleSheetManager target={frameContext.document.head}>
                                <PopupContainer dangerouslySetInnerHTML={{ __html: text }} />
                              </StyleSheetManager>
                            )
                        }
          </FrameContextConsumer>
        </Frame>
      </Wrapper>
    );
  }
}

export default PopupComponent;
