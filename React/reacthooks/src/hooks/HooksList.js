import { Title } from "../utils/Title";
import { EffectHook } from "./EffectHook";
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
        </div>
        
    );
}