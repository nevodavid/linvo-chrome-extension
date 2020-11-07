import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import {useVariable} from "./use.variable";

export type InputPropType = { title: string; icon?: React.ReactElement } & React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputPropType>((props, ref) => {
  const [initialValue, setInitialValue] = useState({
    target: {
      name: props.name,
      value: props.value || "",
    },
  });

  let [timer, setTimer] = useVariable(0);

  const { name, title, icon } = props;

  const onChange = useCallback((event) => {
    setInitialValue({
      target: event.target,
    });
  }, []);

  useEffect(() => {
    if (props.value !== initialValue.target.value) {
      // @ts-ignore
      setInitialValue({
        target: {
          name: props.name,
          value: props.value,
        },
      });
    }
  }, [props.value]);

  useEffect(() => {
    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        // @ts-ignore
        props.onChange && props.onChange(initialValue);
      }, 1000)
    );
  }, [initialValue.target.value]);

  return (
    <fieldset className="position-relative">
      <label htmlFor="basicInput">{title}</label>
      <div className="form-label-group">
        <input
          {...props}
          ref={ref}
          name={name}
          value={initialValue.target.value}
          onChange={onChange}
          onBlur={props.onBlur}
          className="form-control"
        />
        {icon && (
          <div className="form-control-position">
            {icon}
          </div>
        )}
      </div>
    </fieldset>
  );
});
