import { TextContainer } from "./TextContainer";
import { useState, useEffect, FC, useCallback } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import { FaTelegram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { useSettings } from "../../States/Settings";
import debounce from "lodash.debounce";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useQuery } from "react-query";
import { useUser, IOtherUser } from "../../States/User";
import { IMessage } from "../../lib/types";
import { apiUrl, searchPerson } from "../../lib/api";

export let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

function Chat() {
	const navigate = useNavigate();
	const user = useUser((state) => state.currentUser);
	const friends = useUser((state) => state.friends);
	const setFriends = useUser((state) => state.setOnlineFriends);
	const setFriendStatus = useUser((state) => state.setOnlineStatus);
	const addMessage = useUser((state) => state.addMessage);
	const menuOpen = useSettings((state) => state.menuOpen);
	const searchResult = useUser((state) => state.searchResult);
	const setSearchResult = useUser((state) => state.setSearchResult);
	const toggleMenu = useSettings((state) => state.toggleMenu);
	const [searchBar, setSearchBar] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const contacts = useQuery<IOtherUser[]>(
		"contacts",
		async () =>
			await axios
				.get<IOtherUser[]>(`${apiUrl}/user/contacts`, {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				})
				.then((res) => {
					setFriends(res.data);
					return res.data;
				})
	);

	useEffect(() => {
		socket = io(apiUrl, {
			autoConnect: false,
			reconnection: false,
			extraHeaders: { Authorization: `Bearer ${user.token}` },
		});

		socket.connect();

		socket.on("friend_online", (friendID) => {
			console.log({ friendID });
			setFriendStatus(friendID, true);
		});

		socket.on("friend_offline", (friendID) => {
			console.log({ friendID });
			setFriendStatus(friendID, false);
		});

		socket.on("incoming_message", (message: IMessage) => {
			addMessage([message]);
		});

		if (!user.id) {
			navigate("/");
		}

		return () => {
			socket.disconnect();
		};
	}, []);

	const contProps = useSpring({
		to: {
			width: menuOpen ? 400 : 72,
		},
	});

	const searchBarProps = useSpring({
		to: {
			transform: `scale(${searchBar ? 1 : 0})`,
		},
	});

	const changeSearchQuery = async (e: any) => {
		setSearchQuery(e?.target?.value);
		const result = await searchPerson(e?.target?.value);
		setSearchResult(result);
	};

	const debounceChangeHandler = useCallback(
		debounce(changeSearchQuery, 300),
		[]
	);

	const closeSearchBar = () => {
		setSearchQuery("");
		setSearchResult([]);
		setSearchBar((val) => !val);
	};

	return (
		<div className="App">
			<animated.div style={contProps} className="usersContainer">
				<header>
					{menuOpen && !searchBar ? (
						<h1>Weregna</h1>
					) : (
						<span onClick={toggleMenu}>
							<FaTelegram size="24px"></FaTelegram>
						</span>
					)}

					{menuOpen && (
						<>
							<div className="flex-1">
								<animated.input
									onChange={debounceChangeHandler}
									style={searchBarProps}
									className="search-input-field"
									placeholder="Search by Email"
								/>
							</div>
							<span onClick={closeSearchBar}>
								{searchBar ? (
									<MdClose size={"24px"} />
								) : (
									<MdSearch size={"24px"} />
								)}
							</span>
						</>
					)}

					{searchBar && menuOpen && (
						<div className="searchResult--container">
							{searchResult.length == 0 && (
								<span className="info-text">
									No Email Matches
								</span>
							)}

							{searchResult
								.filter((result) => result.id != user.id)
								.map((result) => (
									<UserComponent
										showText={true}
										user={result}
										key={result.id}
										dense
									></UserComponent>
								))}
						</div>
					)}
				</header>
				<div className="usersList">
					{contacts.isLoading && (
						<>
							<UserComponentLoader />
							<UserComponentLoader />
							<UserComponentLoader />
							<UserComponentLoader />
							<UserComponentLoader />
						</>
					)}
					{contacts.isError && <span> error </span>}

					{friends.length > 0 &&
						friends.map((contact) => (
							<UserComponent
								key={contact.id}
								user={contact}
								showText={menuOpen}
							/>
						))}
				</div>
			</animated.div>
			<TextContainer />

			<div className="container">
				<div></div>
			</div>
		</div>
	);
}

export { Chat };
interface IUserComponent {
	showText: boolean;
	user: IOtherUser;
	dense?: boolean;
}
const UserComponent: FC<IUserComponent> = ({
	showText,
	user,
	dense,
}: IUserComponent) => {
	const setMenu = useSettings((state) => state.setMenu);
	const setSelectedUser = useUser((state) => state.setSelectedUser);
	const selectedUser = useUser((state) => state.selectedUser);
	const setUser = () => {
		setSelectedUser(user);
		setMenu(false);
	};

	return (
		<div
			className={`user ${user.isOnline && "online"} ${
				dense && "dense"
			}  ${selectedUser.id === user.id && "selected"}`}
			onClick={setUser}
		>
			<div className="avatar">
				<img src={user.photoUrl} alt="Naol" />
			</div>
			{showText && (
				<div className="textContainer">
					<div className="name">{user.name}</div>
					<div className="lastMessage">{user.email}</div>
				</div>
			)}
		</div>
	);
};

const UserComponentLoader = () => {
	return (
		<div className="user-loader">
			<div className="avatar">
				<div className="img-loader"></div>
			</div>
			<div className="textContainer">
				<div className="name"></div>
				<div className="lastMessage"></div>
			</div>
		</div>
	);
};
