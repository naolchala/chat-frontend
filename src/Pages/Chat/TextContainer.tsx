import axios from "axios";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { MdArrowBack, MdMenu, MdSend } from "react-icons/md";
import { useMutation, useQueryClient } from "react-query";
import { animated, useSpring } from "react-spring";
import { socket } from ".";
import { IMessage } from "../../lib/types";
import { Message } from "./Message";
import { useSettings } from "../../States/Settings";
import { useUser } from "../../States/User";
import { apiUrl } from "../../lib/api";

export const TextContainer = () => {
	const [msgInput, setMsgInput] = useState("");
	const user = useUser((state) => state.currentUser);
	const loadedUsers = useUser((state) => state.loadedUsers);
	const friends = useUser((state) => state.friends);
	const addFriend = useUser((state) => state.addOnlineFriend);
	const addLoadedUsers = useUser((state) => state.addMessageLoadedUser);
	const SelectedUser = useUser((state) => state.selectedUser);
	const menuOpen = useSettings((state) => state.menuOpen);
	const messages = useUser((state) => state.messages);
	const addMessages = useUser((state) => state.addMessage);
	const toggleMenu = useSettings((state) => state.toggleMenu);
	const queryClient = useQueryClient();

	const messagesList = useMutation(
		["messages", SelectedUser.id],
		async () => {
			const data = await axios
				.get<IMessage[]>(`${apiUrl}/user/messages/${SelectedUser.id}`, {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				})
				.then((res) => res.data)
				.then((res) => {
					addMessages(res);
					addLoadedUsers(SelectedUser.id);
					return res;
				});

			return data;
		}
	);

	const dummyBottom = useRef<HTMLDivElement>(null);

	const backProps = useSpring({
		to: {
			transform: `scale(${menuOpen ? 1 : 0}) rotate(${
				menuOpen ? 0 : 90
			}deg) translate(-50%, -50%)`,
		},
	});

	const menuProps = useSpring({
		to: {
			transform: `scale(${menuOpen ? 0 : 1}) rotate(${
				menuOpen ? -90 : 0
			}deg) translate(-50%, -50%)`,
		},
	});

	useEffect(() => {
		if (loadedUsers.indexOf(SelectedUser.id) == -1) {
			messagesList.mutate();
		}
	}, [SelectedUser.id]);

	if (!SelectedUser.id) {
		return <div></div>;
	}

	const sendMessage = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const contact = friends.find((friend) => SelectedUser.id == friend.id);
		let newContact = false;

		if (!contact) {
			newContact = true;
			addFriend(SelectedUser);
		}

		socket.emit("send_message", {
			from_id: user.id,
			to_id: SelectedUser.id,
			content: {
				text: msgInput,
			},
			newContact,
		});
		setMsgInput("");
	};

	return (
		<div className="messagesContainer">
			<div className="header">
				<button className="ic" onClick={toggleMenu}>
					<animated.span style={backProps}>
						<MdArrowBack />
					</animated.span>

					<animated.span style={menuProps}>
						<MdMenu />
					</animated.span>
				</button>
				<img src={SelectedUser.photoUrl} alt="" className="avatar" />
				{SelectedUser.name}
			</div>
			<div className="txtContainer">
				{messagesList?.isLoading ? (
					<div className="loading">Loading ...</div>
				) : messagesList?.isError ? (
					<div className="error">Error happened</div>
				) : (
					<>
						{messages &&
							messages
								.filter(
									(message) =>
										message.from_id == SelectedUser.id ||
										message.to_id == SelectedUser.id
								)
								.map((message) => (
									<Message
										key={message.id}
										{...message}
									></Message>
								))}
						<div ref={dummyBottom} className="dummyBottom"></div>
					</>
				)}
			</div>
			<form className="messageForm" onSubmit={sendMessage}>
				<input
					placeholder="Message"
					type={"text"}
					value={msgInput}
					onChange={(e) => setMsgInput(e.target.value)}
				></input>
				<button type="submit" onClick={() => {}}>
					<MdSend />
				</button>
			</form>
		</div>
	);
};
