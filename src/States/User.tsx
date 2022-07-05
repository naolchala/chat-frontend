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
    selectedUser: IOtherUser;
    setUser: (newUser: IUser) => void;
    setSelectedUser: (newSelectedUser: IOtherUser) => void;
    logout: () => void;
}

export const useUser = create<IUserState>((set) => ({
    currentUser: {} as IUser,
    setUser: (newUser: IUser) => set({ currentUser: newUser }),
    logout: () => set({ currentUser: {} as IUser }),
    selectedUser: {} as IOtherUser,
    setSelectedUser: (newSelectedUser: IOtherUser) =>
        set({ selectedUser: newSelectedUser }),
}));

export interface IFriendsState {
    friends: IOtherUser[];
    searchResult: IOtherUser[];
    setSearchResult: (result: IOtherUser[]) => void;
    addOnlineFriend: (friend: IOtherUser) => void;
    setOnlineFriends: (friends: IOtherUser[]) => void;
    setOnlineStatus: (id: string, status: boolean) => void;
}
export const useFriends = create<IFriendsState>((set, get) => {
    return {
        friends: [] as IOtherUser[],
        searchResult: [] as IOtherUser[],
        setSearchResult: (result: IOtherUser[]) =>
            set({ searchResult: result }),
        addOnlineFriend: (friend: IOtherUser) => {
            set((state) => ({
                friends: [...state.friends, friend],
            }));
        },

        setOnlineFriends: (friends: IOtherUser[]) => {
            set((state) => ({ friends: friends }));
        },

        setOnlineStatus: (id: string, status: boolean) => {
            const u = get().friends.filter((user) => user.id == id)[0];
            const nu = get().friends.filter((user) => user.id != id);
            u.isOnline = status;

            set((state) => ({
                friends: [...nu, u],
            }));
        },
    };
});
