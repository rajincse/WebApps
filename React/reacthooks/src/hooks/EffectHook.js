import { useEffect, useState } from "react";

export function EffectHook(props)
{
    const [a,setA] = useState(0);
    const [b, setB] = useState(100);
    useEffect(()=>{
        console.log(`A:${a}, B:${b}`);
        setB(a);
    });
    return (
        <div>
            <div>Current Value of A: {a}</div>
            <div>Current Value of B: {b}</div>
            <button onClick={()=> setA(a+1)}>
                Increase A
            </button>
        </div>
    );
}