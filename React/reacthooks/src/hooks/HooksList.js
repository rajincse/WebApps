import { Title } from "../utils/Title";
import { ContextHook } from "./ContextHook";
import { EffectHook } from "./EffectHook";
import { ReducerHook } from "./ReducerHook";
import { StateHook } from "./StateHook";

export function HooksList(props)
{
    return (
        <div>
            <div>...............................</div>
            <Title>StateHook</Title>
            <StateHook />
            <div>...............................</div>

            <div>...............................</div>
            <Title>EffectHook</Title>
            <EffectHook />
            <div>...............................</div>

            <div>...............................</div>
            <Title>ContextHook</Title>
            <ContextHook />
            <div>...............................</div>

            <div>...............................</div>
            <Title>ReducerHook</Title>
            <ReducerHook />
            <div>...............................</div>
        </div>
        
    );
}