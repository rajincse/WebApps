import { useMemo, useState } from "react";

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
export function MemoHook(props) {
    const n = 40;
    const result = useMemo(() => {
        return fib(n);
    }, [n]);

    return (
        <div>{n}'th Fibonacci Number: {result}</div>
    );

}