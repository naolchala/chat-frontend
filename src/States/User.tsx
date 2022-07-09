import produce from "immer";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { IMessage } from "../lib/types";

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
	setCurrentUser: (newUser: IUser) => void;
	logout: () => void;

	selectedUser: IOtherUser;
	setSelectedUser: (newSelectedUser: IOtherUser) => void;

	messages: IMessage[];
	loadedUsers: String[];
	addMessage: (message: IMessage[]) => void;
	setMessages: (messages: IMessage[]) => void;
	addMessageLoadedUser: (id: string) => void;

	friends: IOtherUser[];
	setOnlineStatus: (id: string, status: boolean) => void;
	addOnlineFriend: (friend: IOtherUser) => void;
	setOnlineFriends: (friends: IOtherUser[]) => void;

	searchResult: IOtherUser[];
	setSearchResult: (result: IOtherUser[]) => void;
}

export const useUser = create<IUserState>()(
	devtools((set, get) => ({
		// Current User States
		currentUser: {} as IUser,
		setCurrentUser: (newUser: IUser) => set({ currentUser: newUser }),
		logout: () => set({ currentUser: {} as IUser }),

		// Selected User States
		selectedUser: {} as IOtherUser,
		setSelectedUser: (newSelectedUser: IOtherUser) =>
			set({ selectedUser: newSelectedUser }),

		// Messages
		messages: [],
		loadedUsers: [],
		addMessage: (message: IMessage[]) => {
			return set((state) => ({
				messages: [...message, ...state.messages],
			}));
		},
		setMessages: (messages: IMessage[]) => {
			return set({ messages });
		},
		addMessageLoadedUser: (id: string) => {
			set((state) => ({ loadedUsers: [...state.loadedUsers, id] }));
		},

		// Friends
		friends: [] as IOtherUser[],
		addOnlineFriend: (friend: IOtherUser) => {
			set((state) => ({
				friends: [...state.friends, friend],
			}));
		},
		setOnlineFriends: (friends: IOtherUser[]) => {
			set({ friends: friends });
		},
		setOnlineStatus: (id: string, status: boolean) => {
			set(
				produce((state: IUserState) => {
					const current = state.friends.find(
						(friend) => friend.id == id
					);

					if (current) {
						current.isOnline = status;
					}
				})
			);
		},

		// Search Results
		searchResult: [] as IOtherUser[],
		setSearchResult: (result: IOtherUser[]) =>
			set({ searchResult: result }),
	}))
);
