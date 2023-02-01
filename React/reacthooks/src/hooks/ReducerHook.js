import { useReducer } from "react";

const ActionType = {
    Increment: 0,
    Decrement: 1
}

function reducer(state, action)
{
    if(action.type === ActionType.Increment)
    {
        return {count : state.count+1};
    }
    else
    {
        return {count : state.count-1};
    }
}
export function ReducerHook(props)
{
    const initialState = {count: 0};
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <div>
            <p> Current value: {state.count}</p>
            <button onClick={()=> dispatch({type: ActionType.Increment})}>Increase</button>
            <button onClick={()=> dispatch({type: ActionType.Decrement})}>Decrease</button>
        </div>
    );
}