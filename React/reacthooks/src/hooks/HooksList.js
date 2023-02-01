import { Title } from "../utils/Title";
import { ContextHook } from "./ContextHook";
import { EffectHook } from "./EffectHook";
import { ReducerHook } from "./ReducerHook";
import { StateHook } from "./StateHook";
import { MemoHook } from "./MemoHook";
import { CallbackHook } from "./CallbackHook";

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

            <div>...............................</div>
            <Title>MemoHook</Title>
            <MemoHook />
            <div>...............................</div>

            <div>...............................</div>
            <Title>CallbackHook</Title>
            <CallbackHook />
            <div>...............................</div>
        </div>
        
    );
}