import React, { FunctionComponent } from 'react';
import { FormControl, FormControlLabel, FormGroup, InputLabel, Switch } from '@material-ui/core';
// @ts-ignore
import { useN02SwitchStyles } from '@mui-treasury/styles/switch/n02';

export const DateChoosePicker: FunctionComponent<{
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = (props) => {
  const { checked, onChange } = props;
  const switchStyles = useN02SwitchStyles();

  return (
    <div
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <div
        style={{
          paddingLeft: '0.2rem',
          marginRight: 20,
          fontSize: '0.85rem',
          color: '#464646',
        }}
      >
        Schedule
      </div>
      <div onClick={() => onChange(!checked)}>
        <FormControl>
          <Switch classes={switchStyles} color="primary" size="medium" checked={checked} onChange={() => onChange(!checked)} />
        </FormControl>
      </div>
    </div>
  );
};
