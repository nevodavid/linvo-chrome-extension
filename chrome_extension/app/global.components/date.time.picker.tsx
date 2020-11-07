import React, {FunctionComponent, useContext, useEffect, useLayoutEffect, useRef, useState} from "react";
import {Input, InputPropType} from "./input";
import flatpickr from 'flatpickr';
import styled from "styled-components";
import {Instance} from "flatpickr/dist/types/instance";
import {useVariable} from "./use.variable";
import {FrameContext} from "react-frame-component";
import {DateTimePicker} from "@material-ui/pickers";

const InputWrapper = styled.div`
.flatpickr-wrapper {
  width: 100%;
}
input {
  background: white !important;
}
`;

interface DateTimeProps {
  minDate?: Date;
  maxDate?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date|undefined) => void;
}
export const DateTimePickerComponent: FunctionComponent<InputPropType & DateTimeProps> = (props) => {
  const {onDateChange, defaultDate, minDate, maxDate} = props;
  const [checkChangeValue, setCheckChangeValue] = useVariable<Date>(props.defaultDate);

  useEffect(() => {
    if (defaultDate && checkChangeValue && defaultDate?.toString() !== checkChangeValue?.toString()) {
      setCheckChangeValue(defaultDate);
    }
  }, [defaultDate]);


  return (
      <DateTimePicker
          style={{flex: 1}}
          format="dd/mm/Y HH:mm"
          minDate={minDate}
          maxDate={maxDate} variant="inline"
          label="Click to pick a date"
          value={defaultDate}
          onChange={onDateChange}
      />
  )
};
