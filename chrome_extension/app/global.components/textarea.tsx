import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useVariable } from "./use.variable";
import styled from "styled-components";

interface BbcodesInterface {
  label: string;
  bbcodeName: string;
}

const Field = styled.fieldset`
  min-width: 0;
  padding: 0;
  margin: 0;
  border: 0;
  position: relative;
  label {
    color: #464646;
    font-size: 0.85rem;
    margin-bottom: 0;
    padding-left: 0.2rem;
  }
  .form-label-group {
    position: relative;
    margin-bottom: 1.5rem;
  }
  .btn-group-vertical {
    align-items: flex-start;
    justify-content: center;
  }
  .btn-outline-primary {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: transparent;
    font-size: 1rem;
    line-height: 1;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    width: 100px;
    margin-right: 10px;
    flex: 0 0 auto;
    padding: 5px;
    border-radius: 6px 6px 0px 0px;
    border: 1px solid #7367f0;
    color: #7367f0;
  }
  textarea {
    display: block;
    width: 100%;
    font-weight: 400;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    border-top-left-radius: 0px;
    height: 200px;
    line-height: 1.6rem;
    font-size: 1rem;
    border: 1px solid #d9d9d9;
    font-family: Roboto;
    color: #5f5f5f;
  }
`;
export const TextArea: FunctionComponent<
  React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > & { title: string; bbcodes?: BbcodesInterface[] }
> = (props) => {
  const { title, bbcodes, onChange, name } = props;
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [valuer, setValue] = useState<string>(String(props.value || ''));
  const [timer, setTimer] = useVariable(0);

  const addLabel = (label: string) => () => {
    const selection = textAreaRef.current!.selectionStart;
    const value = textAreaRef.current!.textContent;
    const before = (value || "").slice(0, selection);
    const after = (value || "").slice(selection, value?.length || 0);
    const labelShow = "{{" + label + "}}";
    setValue(before + labelShow + after);
    setValueTimer(before + labelShow + after);
    setTimeout(() => {
      textAreaRef.current!.selectionStart = +selection + labelShow.length;
      textAreaRef.current!.focus();
    }, 10);
  };

  const setValueTimer = (value: string) => {
    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        // @ts-ignore
        onChange && onChange({ target: { name, value } });
      }, 1000)
    );
  };

  const setNewValue = (event: any) => {
    setValue(event.target.value);
    setValueTimer(event.target.value);
  };

  return (
    <Field className="position-relative">
      <label htmlFor="basicInput">{title}</label>
      <div className="form-label-group">
        <div
          style={{ display: "flex", flexDirection: "row" }}
          className="btn-group-vertical"
        >
          {bbcodes &&
            bbcodes.map((bbcode) => (
              <button
                onClick={addLabel(bbcode.bbcodeName)}
                style={{
                  width: 100,
                  marginRight: 10,
                  flex: "none",
                  padding: 5,
                  borderBottom: 0,
                  borderTopRightRadius: 6,
                  borderTopLeftRadius: 6,
                  borderBottomRightRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
                className="btn btn-outline-primary waves-effect waves-light"
              >
                {bbcode.label}
              </button>
            ))}
          <div style={{ flex: 1 }} />
        </div>
        {
          // @ts-ignore
          <textarea
            ref={textAreaRef}
            className="form-control"
            spellCheck={true}
            {...props}
            {...(bbcodes && bbcodes.length
              ? { style: { borderTopLeftRadius: 0, ...(props.style || {}) } }
              : props.style)}
            value={valuer}
            onChange={setNewValue}
          />
        }
        {props.maxLength && (
            <div style={{ float: "left", fontSize: '0.85rem', color: 'rgb(70, 70, 70)', marginTop: 3, marginBottom: 20 }}>
              Please take into consideration that parameters will increase the message size<br />
              Message size bigger than {props.maxLength} characters will not be sent
            </div>
        )}
        <div style={{ float: "right" }}>
          {props.maxLength - (valuer || "").length}
        </div>
      </div>
    </Field>
  );
};
