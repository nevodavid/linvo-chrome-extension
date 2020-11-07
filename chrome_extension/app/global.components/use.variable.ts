import {useRef} from "react";

export const useVariable = <T = {}>(initialValue?: T) => {
    const ref = useRef([
        initialValue,
        (param: T) => {
            ref.current[0] = typeof param === "function"
                ? param(ref.current[0])
                : param
        }
    ]);
    return ref.current as [
        T,
        (param: T) => void
    ];
};
