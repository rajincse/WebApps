import { useState } from "react";

export function StateHook(props)
{
    const [count, setCount] = useState(0);
    return (
        <div>
            <p> You have clicked {count} times</p>
            <button onClick={()=> setCount(count+1)}>
                Click
            </button>
        </div>
    );
}