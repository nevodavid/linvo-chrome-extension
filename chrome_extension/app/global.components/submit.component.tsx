import styled from 'styled-components';
import React, { FC } from 'react';
import Loader from 'react-loader-spinner';

export const Sub = styled.button`
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: 0.9rem 1rem;
  font-size: 1rem;
  line-height: 1;
  border-radius: 0.4285rem;
  outline: none;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  margin: 0px;
  border-color: #4839eb !important;
  background-color: ${(params: { disabled?: boolean }) =>
    params.disabled ? '#c4c1f6' : '#7367f0'}; !important;
  color: #fff;
  border: 0;
  cursor: pointer;
 
`;

interface SubmitInterface {
  loader?: boolean;
}
export const Submit: FC<
  SubmitInterface &
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
> = (props) => (
  // @ts-ignore
  <Sub {...props} disabled={props.disabled || props.loader}>
    {props.loader ? (
      <>
        <div style={{height: 0, visibility: "hidden", overflow: "hidden"}}>{props.children}</div>
        <Loader color="#fff" width={20} height={20} type="Oval" />
      </>
    ) : props.children}
  </Sub>
);
