import { createContext  } from "react";
export const Users= {
    Sayeed: {
        name: "Sayeed Alam",
        nickName: "Rajin"
    }, 
    Nahid: {
        name: "Nahid Ferdous",
        nickName: "Munia"
    }, 
    Zaisha: {
        name: "Zaisha Ferdous Alam",
        nickName: "Zaisha"
    }, 
};

export const UserContext = createContext(Users.Zaisha);