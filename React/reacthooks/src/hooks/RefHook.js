import { useRef } from "react";

export function RefHook(props) {
    const refInput = useRef(null);
    return (
        <div>
            <input ref={refInput} type="text"></input>
            <button onClick={() => {
                refInput.current.focus();
            }}>Click Me</button>
        </div>
    );
}