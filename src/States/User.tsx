import { createContext, FC, ReactNode, useContext, useState } from "react";

interface IUser {
    id: string;
    name: string;
    email: string;
    bio?: string;
    photoUrl?: string;
    token: string;
    isOnline: boolean;
    lastseen: string;
}

interface IUserContext {
    user: IUser;
    setUser: (user: IUser) => void;
}
const UserContext = createContext({} as IUserContext);

const UserProvider: FC<{ children?: ReactNode }> = (props) => {
    const [user, setCurrentUser] = useState({} as IUser);
    const setUser = (newUser: IUser) => setCurrentUser(newUser);
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {props.children}
        </UserContext.Provider>
    );
};

const useUser = () => useContext(UserContext);

export { UserProvider, useUser };
export type { IUser };
