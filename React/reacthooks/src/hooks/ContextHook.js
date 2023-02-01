import { useContext } from "react";
import { UserContext } from "../utils/Users";

export function ContextHook(props){
    const user = useContext(UserContext);
    return (
        <div>Current user: {user.nickName}</div>
    );
}