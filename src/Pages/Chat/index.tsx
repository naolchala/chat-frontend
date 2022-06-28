import { useState, useRef, useEffect, FC } from "react";
import { MdArrowBack, MdMenu, MdSearch, MdSend } from "react-icons/md";
import { FaTelegram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { io } from "socket.io-client";
import { Message } from "../../Message";
import { IOtherUser, IUser, useUser } from "../../States/User";
import { apiUrl } from "../Login";
import { useContacts, useFetch } from "../../lib/api";
import { useFormikContext } from "formik";
import axios from "axios";

function Chat() {
    let socket;
    const navigate = useNavigate();
    const user = useUser((state) => state.currentUser);
    const [userCont, setUserCont] = useState(true);
    const [msg, setMessage] = useState("");
    const [chat, setChat] = useState([] as any[]);
    const [privateMsg, setPrivateMsg] = useState([] as any[]);
    const [reciver, setReciver] = useState("");
    const msgBottom = useRef<null | HTMLDivElement>(null);

    const [contacts, loading_contacts, contacts_error] = useFetch<IOtherUser[]>(
        async () =>
            await axios.get(`${apiUrl}/user/contacts`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
    );

    const me = "l";
    const sendMsg = () => null;

    const contProps = useSpring({
        to: {
            width: userCont ? 400 : 72,
        },
    });

    const backProps = useSpring({
        to: {
            transform: `scale(${userCont ? 1 : 0}) rotate(${
                userCont ? 0 : 90
            }deg) translate(-50%, -50%)`,
        },
    });

    const menuProps = useSpring({
        to: {
            transform: `scale(${userCont ? 0 : 1}) rotate(${
                userCont ? -90 : 0
            }deg) translate(-50%, -50%)`,
        },
    });

    useEffect(() => {
        socket = io(apiUrl, {
            extraHeaders: {
                Authorization: `Bearer ${user.token}`,
            },
        });

        if (!user.id) {
            navigate("/");
        }
    }, []);
    return (
        <div className="App">
            <animated.div style={contProps} className="usersContainer">
                <header>
                    {userCont ? (
                        <h1>Weregna</h1>
                    ) : (
                        <span>
                            <FaTelegram size="24px"></FaTelegram>
                        </span>
                    )}

                    {userCont && (
                        <>
                            <div className="flex-1"></div>
                            <span>
                                <MdSearch size={"24px"} />
                            </span>
                        </>
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
                    {contacts &&
                        contacts.map((contact) => (
                            <UserComponent
                                key={contact.id}
                                user={contact}
                                showText={userCont}
                            />
                        ))}
                </div>
            </animated.div>
            <div className="messagesContainer">
                <div className="header">
                    <button
                        className="ic"
                        onClick={(e) => setUserCont((val) => !val)}
                    >
                        <animated.span style={backProps}>
                            <MdArrowBack />
                        </animated.span>

                        <animated.span style={menuProps}>
                            <MdMenu />
                        </animated.span>
                    </button>
                    <img src={user.photoUrl} alt="" className="avatar" />
                    {user.name}
                </div>
                <div className="txtContainer">
                    {reciver == "" ? (
                        <div className="msg-container">
                            {chat.map((c, index) => (
                                <Message message={c} key={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="msg-container">
                            {privateMsg
                                .filter(
                                    (msg) =>
                                        msg.sender.id == reciver ||
                                        msg.receiver.id == reciver
                                )
                                .map((c) => (
                                    <div
                                        className={`message ${
                                            c.sender.id == me ? "mine" : ""
                                        }`}
                                    >
                                        <img
                                            src={c.sender.img}
                                            alt={c.sender.name}
                                        />
                                        <span>{c.msg}</span>
                                    </div>
                                ))}
                        </div>
                    )}
                    <div ref={msgBottom} className="dummyBottom"></div>
                </div>
                <form className="messageForm" onSubmit={sendMsg}>
                    <input
                        placeholder="Message"
                        type={"text"}
                        value={msg}
                        onChange={(e) => setMessage(e.target.value)}
                    ></input>
                    <button type="submit" onClick={() => sendMsg()}>
                        <MdSend />
                    </button>
                </form>
            </div>

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
}
const UserComponent: FC<IUserComponent> = ({
    showText,
    user,
}: IUserComponent) => {
    console.log({ user });
    return (
        <div className="user">
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
