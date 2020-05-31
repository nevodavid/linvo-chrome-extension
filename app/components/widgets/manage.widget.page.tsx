import React, { Component } from 'react';
import { connect } from 'react-redux';
import RichTextEditor from 'react-rte';
import styled, { createGlobalStyle } from 'styled-components';
import { AppState } from '../../store/reducers/app.state';
import { Widget } from '../../store/reducers/widget';
import { UpdateWidget, WidgetsActions } from '../../store/actions/widgets';

interface ManageWidgetPageProps {
  widget: Widget,
  updateWidget: (payload: Omit<UpdateWidget, 'domain'>, domain: string) => Promise<any>;
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
class ManageWidgetPage extends Component<ManageWidgetPageProps> {
  state = {
    title: '',
    text: RichTextEditor.createEmptyValue()
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
      title: widget.title,
      text: widget.text ? RichTextEditor.createValueFromString(widget.text, 'html') : text
    });
  }

  changeText = (text: any) => {
    this.setState({
      text
    });
  }

  changeTitle = (event: any) => {
    this.setState({
      title: event.target.value
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
    const { title, text } = this.state;

    await updateWidget({
      ...widget,
      title,
      text: text.toString('html')
    }, domain);

    this.reloadComponent();
    this.goBack();
  }

  render() {
    const { title, text } = this.state;
    return (
      <Wrapper>
        <BodyChange />
        <div style={{ fontSize: 15, marginBottom: 10 }} className="wrapper" onClick={this.goBack}>
          GO BACK TO WIDGET LIST
        </div>
        <div className="wrapper" style={{ marginBottom: 20 }}>
          Title: <input style={{ fontSize: 30 }} type="text" value={title} onChange={this.changeTitle} />
        </div>
        <div>
          <div className="wrapper" style={{ marginBottom: 10 }}>
            Content:
          </div>
          <RichTextEditor
            value={text}
            onChange={this.changeText}
          />
          <button style={{ fontSize: 20 }} onClick={this.save}>Save</button>
        </div>
      </Wrapper>
    );
  }
}

export default connect((app: AppState, props) => ({
  // @ts-ignore
  widget: app.widgets[props.match.params.domain].find(p => p.id === props.match.params.id)
}), (dispatch) => ({
  // eslint-disable-next-line new-cap
  updateWidget: (payload: Omit<UpdateWidget, 'domain'>, domain = '') => dispatch(WidgetsActions.UpdateWidget(payload, domain))
}))(ManageWidgetPage);
