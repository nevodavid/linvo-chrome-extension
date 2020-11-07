import React, {useEffect, useRef, useState} from "react";
import { Button, Modal as ModalComponent } from "react-bootstrap";
import styled, {StyleSheetManager, ThemeProvider} from "styled-components";
import Frame, {FrameContextConsumer} from "react-frame-component";
import {Global} from "../background/components/helper/helper";
import {createMuiTheme, StylesProvider} from '@material-ui/core/styles';
import { create } from "jss";
import { jssPreset } from "@material-ui/core/styles";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import {Submit} from "./submit.component";

export interface ModalButtonInterface {
  variant: "secondary" | "primary";
  name: string;
  isLoading?: boolean;
  onClick: () => void;
}

export interface BasicModalInterface {
  close: () => void;
  button: (params: ModalButtonInterface[]) => React.ReactElement;
}

interface ShowModalInterface {
  component: (params: BasicModalInterface) => React.ReactElement;
  header?: string;
}

const initialModalState: {
  show: boolean;
  component: null | React.ReactElement;
  header?: string;
} = {
  show: false,
  component: null,
  header: "",
};

const Wrapper = styled.div`
  ${// @ts-ignore
  window.getStyles()["bootstrap.css"]}
`;

const CustomHead = () => {
  return (
      <>
        <meta charSet="utf-8" />
        <title>Previewer</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <base target="_parent" />
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </>
  );
};
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#7367f0"
    },
    secondary: {
      main: "#19857b"
    },
    background: {
      default: "#dedede",
      paper: "#ffffff"
    }
  }
});

const F = styled.div`
iframe {
  width: 100%;
  height: 23px;
  overflow: hidden;
}
`;
export let showModal = (params: ShowModalInterface) => {};
export const Modal = () => {
  const [modal, setModal] = useState({ ...initialModalState });
  const [displayModal, setDisplayModal] = useState(false);

  const closeModal = () => {
    setDisplayModal(false);
  };

  const button = (params: ModalButtonInterface[]) => (
    <ModalComponent.Footer style={{ paddingLeft: 0, paddingRight: 0 }}>
      {params.map((todo) => (
        <Submit
          loader={todo.isLoading}
          // lock={todo.isLoading}
          // variant={todo.variant}
          onClick={todo.onClick}
        >{todo.name}</Submit>
      ))}
    </ModalComponent.Footer>
  );

  showModal = (params: ShowModalInterface) => {
    setDisplayModal(true);
    setModal({
      show: true,
      component: params.component({ close: closeModal, button }),
      header: params.header,
    });
  };

  useEffect(() => {
    if (!displayModal && modal.component) {
      setTimeout(() => {
        setModal({ ...initialModalState });
      }, 500);
    }
  }, [displayModal]);

  return (
    <Wrapper className="wrappers" style={{zIndex: 999999999, position: 'relative'}}>
      <ModalComponent
        size="lg"
        centered
        show={displayModal}
        keyboard={false}
        backdrop={true}
        container={document.querySelector('.wrappers')}
        onHide={closeModal}
      >
        <ModalComponent.Header closeButton>
          <ModalComponent.Title>
            <F>
              <Frame>
                <FrameContextConsumer>
                  {(frameContext) => {
                    return (
                      <StyleSheetManager target={frameContext.document.head}>
                          <div>
                            <Global />
                            {modal.header}
                          </div>
                      </StyleSheetManager>
                  )}}
                </FrameContextConsumer>
              </Frame>
            </F>
          </ModalComponent.Title>
        </ModalComponent.Header>

        <ModalComponent.Body>
          <Frame head={<CustomHead />} height={600} width="100%">
            <FrameContextConsumer>
              {(frameContext) => {
                const jss = create({
                  plugins: [...jssPreset().plugins],
                  insertionPoint: frameContext.document.head
                });

                return (
                    <StyleSheetManager target={frameContext.document.head}>
                      <StylesProvider jss={jss}>
                        <ThemeProvider theme={theme}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <div>
                              <Global />
                              {modal.component}
                            </div>
                          </MuiPickersUtilsProvider>
                        </ThemeProvider>
                      </StylesProvider>
                    </StyleSheetManager>
                )}}
            </FrameContextConsumer>
          </Frame>
        </ModalComponent.Body>
      </ModalComponent>
    </Wrapper>
  );
};
