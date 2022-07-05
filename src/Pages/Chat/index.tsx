import { TextContainer } from "./TextContainer";
import { useState, useRef, useEffect, FC } from "react";
import { MdArrowBack, MdClose, MdMenu, MdSearch, MdSend } from "react-icons/md";
import { FaTelegram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { io, Socket } from "socket.io-client";
import { Message } from "../../Message";
import { IOtherUser, IUser, useFriends, useUser } from "../../States/User";
import { apiUrl } from "../Login";
import { searchPerson, useContacts, useFetch } from "../../lib/api";
import { useFormikContext } from "formik";
import axios from "axios";
import { useSettings } from "../../States/Settings";
import debounce from "lodash.debounce";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

function Chat() {
    const navigate = useNavigate();
    const user = useUser((state) => state.currentUser);
    const friends = useFriends((state) => state.friends);
    const setFriends = useFriends((state) => state.setOnlineFriends);
    const setFriendStatus = useFriends((state) => state.setOnlineStatus);
    const menuOpen = useSettings((state) => state.menuOpen);
    const searchResult = useFriends((state) => state.searchResult);
    const setSearchResult = useFriends((state) => state.setSearchResult);
    const [searchBar, setSearchBar] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [contacts, loading_contacts, contacts_error] = useFetch<IOtherUser[]>(
        async () =>
            await axios
                .get<IOtherUser[]>(`${apiUrl}/user/contacts`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((res) => {
                    setFriends(res.data);
                    return res;
                })
    );

    useEffect(() => {
        socket = io(apiUrl, {
            extraHeaders: {
                Authorization: `Bearer ${user.token}`,
            },
        });

        socket.on("friend_online", (friendID) => {
            console.log({ friendID });
            setFriendStatus(friendID, true);
        });

        socket.on("friend_offline", (friendID) => {
            console.log({ friendID });
            setFriendStatus(friendID, false);
        });

        if (!user.id) {
            navigate("/");
        }
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

    const changeSearchQuery = (e: any) => {
        setSearchQuery(e?.target?.value);

        debounce(() => {
            console.log("hi");
        }, 500);
    };

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
                        <span onClick={() => setSearchBar(false)}>
                            <FaTelegram size="24px"></FaTelegram>
                        </span>
                    )}

                    {menuOpen && (
                        <>
                            <div className="flex-1">
                                <animated.input
                                    value={searchQuery}
                                    onChange={changeSearchQuery}
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
                    {loading_contacts && (
                        <>
                            <UserComponentLoader />
                            <UserComponentLoader />
                            <UserComponentLoader />
                            <UserComponentLoader />
                            <UserComponentLoader />
                        </>
                    )}
                    {contacts_error && <span> error </span>}

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
    const setSelectedUser = useUser((state) => state.setSelectedUser);
    const selectedUser = useUser((state) => state.selectedUser);
    const setUser = () => {
        setSelectedUser(user);
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
