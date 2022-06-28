import create from "zustand";

export interface IUser {
    id: string;
    name: string;
    email: string;
    bio?: string;
    photoUrl?: string;
    token: string;
    isOnline: boolean;
    lastseen: string;
}

export type IOtherUser = Omit<IUser, "token">;

export interface IUserState {
    currentUser: IUser;
    setUser: (newUser: IUser) => void;
    logout: () => void;
}

export const useUser = create<IUserState>((set) => ({
    currentUser: {} as IUser,
    setUser: (newUser: IUser) => set({ currentUser: newUser }),
    logout: () => set({ currentUser: {} as IUser }),
}));

export interface IFriendsState {
    friends: IOtherUser[];
    addOnlineFriend: (friend: IOtherUser) => void;
    setOnlineStatus: (id: string, status: boolean) => void;
}
export const useFriends = create<IFriendsState>((set, get) => {
    return {
        friends: [] as IOtherUser[],
        addOnlineFriend: (friend: IOtherUser) => {
            set((state) => ({
                friends: [...state.friends, friend],
            }));
        },

        setOnlineStatus: (id: string, status: boolean) => {
            const u = get().friends.filter((user) => user.id == id)[0];
            u.isOnline = status;

            set((state) => ({
                friends: [...state.friends, u],
            }));
        },
    };
});
