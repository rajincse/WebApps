import { useCallback, useMemo, useState } from "react";

function fib(n) {
    if (n === 0) {
        return 0;
    }
    else if (n === 1) {
        return 1;
    }
    else {
        return fib(n - 1) + fib(n - 2);
    }
}

export function CallbackHook(props) {
    const n = 40;
    const [result, setResult] = useState(0);
    const calculateFib = useCallback(()=>{
        const val = fib(n);
        setResult(val);
    },[n]);   

    return (
        <div>
            <button onClick={calculateFib}>Calculate</button>
            <div>{n}'th Fibonacci Number: {result}</div>
        </div>
        
    );

}