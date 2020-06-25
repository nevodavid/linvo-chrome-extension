import React, { Component } from 'react';
import { connect } from 'react-redux';
import RichTextEditor from 'react-rte';
import { Editor } from 'react-draft-wysiwyg';
import {ContentState, EditorState} from "draft-js";
// @ts-ignore
import htmlToDraft from 'html-to-draftjs';
import styled, { createGlobalStyle } from 'styled-components';
import { AppState } from '../../store/reducers/app.state';
import { Widget } from '../../store/reducers/widget';
import { UpdateWidget, WidgetsActions } from '../../store/actions/widgets';
import UploadComponent from "../upload/upload.component";
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
// @ts-ignore
import createCodeEditorPlugin from 'draft-js-code-editor-plugin';


interface ManageWidgetPageProps {
  widget: Widget,
  updateWidget: (payload: Omit<UpdateWidget, 'domain'>, domain: string) => Promise<any>;
  deleteWidget: (id: string, domain: string) => Promise<any>;
}

const BodyChange = createGlobalStyle`
    body {
        width: 700px;
        min-height: 1000px;
    }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  .wrapper {
    color: #ffce00;
    font-size: 30px;
  }
`;

interface ManageWidgetState {
  title: string;
  editorState: any;
  text: any;
  type: 'popup' | 'pixel';
}

class ManageWidgetPage extends Component<ManageWidgetPageProps, ManageWidgetState> {
  state: ManageWidgetState = {
    title: '',
    text: '',
    type: 'popup',
    editorState: EditorState.createEmpty()
  }

  componentDidMount(): void {
    this.updateWidget();
  }

  // eslint-disable-next-line react/sort-comp
  reloadComponent = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tab) => {
      chrome.tabs.executeScript(tab[0].id, { code: 'window.reloadStore()' });
    });
  }

  updateWidget = () => {
    const { widget } = this.props;
    const { text } = this.state;

      this.setState({
      title: widget.title || '',
      type: widget.type || 'popup',
      text: widget.text
    });
  }

  changeText = (text: any) => {
    this.setState({
      text
    });
  }

  changeTextNormal = (event: any) => {
    this.setState({
      text: event.target.value
    });
  }

  changeTitle = (event: any) => {
    this.setState({
      title: event.target.value
    });
  }

  changeType = (event: any) => {
    this.setState({
      type: event.target.value
    });
  }

  goBack = () => {
    const {
      // @ts-ignore
      history: {
        // @ts-ignore
        push
      } } = this.props;
    push('/widgets');
  }

  save = async () => {
    const { updateWidget, widget,
      // @ts-ignore
      match: {
        params: {
          domain
        }
      }
    } = this.props;
    const { title, type, text } = this.state;

    await updateWidget({
      ...widget,
      title,
      type: type || 'popup',
      text: type === 'popup' ? draftToHtml(convertToRaw(text.getCurrentContent())) + '</figure>' : text
    }, domain);

    this.reloadComponent();
    this.goBack();
  }

  delete = async () => {
    const {deleteWidget, widget,
      // @ts-ignore
      match: {
        params: {
          domain
        }
      }
    } = this.props;
    await deleteWidget(widget.id, domain);
    this.goBack();
  };

  onDrop = (picture: any) => {
    console.log(picture);
  }

  upload = (upload: string) => {
    const {text} = this.state;
    const newText = draftToHtml(convertToRaw(text.getCurrentContent())) + `<figure><img alt="" width="100" height="100" src="${upload}" /></figure>`;
    this.setState({
      text: this.getHtml(newText)
    })
  };

  onEditorStateChange = (text: any) => {
    this.setState({
      text
    })
  }

  getHtml = (text: string) => {
    const blocksFromHtml = htmlToDraft(text);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    return EditorState.createWithContent(contentState);
  }
  render() {

    const { title, text, type } = this.state;
    const textShow = typeof text !== 'string' ? text : (
        !text ? EditorState.createEmpty() : this.getHtml(text)
    );

    const textToShow = typeof text !== 'string' ? text : '';

    return (
      <Wrapper>
        <BodyChange />
        <div style={{ fontSize: 15, marginBottom: 10 }} className="wrapper" onClick={this.goBack}>
          {'<'} GO BACK TO WIDGET LIST
        </div>
        <div className="wrapper" style={{ marginBottom: 20 }}>
          Type:
          <select style={{ fontSize: 30 }} value={type} onChange={this.changeType}>
            <option selected={type === 'popup'} value="popup" >Pop up</option>
            <option selected={type === 'pixel'} value="pixel">Facebook Pixel</option>
          </select>
        </div>

        {type === 'popup' && (
            <div style={{ marginBottom: 20, width: '100%', overflow: "auto" }}>
              <div className="wrapper" style={{ marginBottom: 20 }}>
                Title: <input style={{ fontSize: 30 }} type="text" value={title} onChange={this.changeTitle} />
              </div>
              <div>
                <div className="wrapper" style={{ marginBottom: 10 }}>
                  Content:
                </div>
                <div style={{background: 'white'}}>
                  <Editor
                      editorState={textShow}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      toolbarCustomButtons={[<UploadComponent addImage={this.upload} />]}
                      onEditorStateChange={this.onEditorStateChange}
                  />
                </div>
                {/*<RichTextEditor*/}
                {/*  // @ts-ignore*/}
                {/*  value={textShow}*/}
                {/*  onChange={this.changeText}*/}
                {/*/>*/}
              </div>
            </div>
        )}

        {type === 'pixel' && (
            <>
              <div className="wrapper" style={{ marginBottom: 20 }}>
                Event Name: <input style={{ fontSize: 30 }} type="text" value={title || ''} onChange={this.changeTitle} />
              </div>
              <div className="wrapper" style={{ marginBottom: 20 }}>
                Pixel Number: <input style={{ fontSize: 30 }} type="text"
                                    // @ts-ignore
                                     value={textToShow || ''} onChange={this.changeTextNormal} />
              </div>
            </>
        )}

        <button style={{ fontSize: 20 }} onClick={this.save}>Save</button>

        <button onClick={this.delete} style={{ cursor: 'pointer', background: 'transparent', padding: 0, border: 0, fontSize: 15, color: 'red', marginTop: 20 }}>Delete Widget</button>
      </Wrapper>
    );
  }
}

export default connect((app: AppState, props) => ({
  // @ts-ignore
  widget: app.widgets[props.match.params.domain].find(p => p.id === props.match.params.id)
}), (dispatch) => ({
  // eslint-disable-next-line new-cap
  updateWidget: (payload: Omit<UpdateWidget, 'domain'>, domain = '') => dispatch(WidgetsActions.UpdateWidget(payload, domain)),
  deleteWidget: (id: string, domain = '') => dispatch(WidgetsActions.DeleteWidget({id}, domain))
}))(ManageWidgetPage);
