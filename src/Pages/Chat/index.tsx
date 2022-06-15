import { useState, useRef, useEffect } from "react";
import { MdArrowBack, MdMenu, MdSend } from "react-icons/md";
import { useSpring, animated } from "react-spring";
import { io } from "socket.io-client";
import { Message } from "../../Message";

const socket = io("http://192.168.0.5:5000", {
    // autoConnect: false,
});

function Chat() {
    const [userCont, setUserCont] = useState(false);
    const [msg, setMessage] = useState("");
    const [chat, setChat] = useState([] as any[]);
    const [privateMsg, setPrivateMsg] = useState([] as any[]);
    const [users, setUsers] = useState([] as any[]);
    const [reciver, setReciver] = useState("");
    const msgBottom = useRef<null | HTMLDivElement>(null);

    const me = window.sessionStorage.getItem("id");

    const sendToSingle = () => {
        socket.emit("msgTo", {
            id: window.sessionStorage.getItem("id"),
            reciver,
            msg,
        });
    };

    const sendMsg = (ev: any) => {
        ev.preventDefault();
        if (msg != "") {
            setMessage("");
            if (reciver == "") {
                socket.emit("msg", {
                    id: window.sessionStorage.getItem("id"),
                    msg,
                });
            } else {
                sendToSingle();
            }
        }

        ScrollToMessageBottom();
    };

    const ScrollToMessageBottom = () =>
        msgBottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });

    const changeReceiver = (rec: string) => {
        setReciver(rec);
        ScrollToMessageBottom();
    };

    const getUser = (id: string) => users.filter((user) => user.id == id);

    useEffect(() => {
        socket.on("msgs", (data) => setChat((val) => [...val, data]));
        socket.on("toMe", (data) => setPrivateMsg((val) => [...val, data]));

        socket.on("Connected", ({ id }) =>
            window.sessionStorage.setItem("id", id)
        );

        socket.on("users", (data) => setUsers(data));

        return () => {
            socket.on("msgs", (data) => {});
        };
    }, []);

    const contProps = useSpring({
        to: {
            width: userCont ? 72 : 0,
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
    return (
        <div className="App">
            <animated.div style={contProps} className="usersContainer">
                <button className="usercard" onClick={() => setReciver("")}>
                    <img src="/icons8-globe-96.png" alt="" />
                </button>
                {users
                    .filter((u) => u.id != me)
                    .map((u) => (
                        <button
                            className="usercard"
                            disabled={u.id == me}
                            onClick={() => setReciver(u.id)}
                        >
                            <img src={u.img}></img>
                        </button>
                    ))}
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
                    <img
                        src={
                            reciver == ""
                                ? "/icons8-globe-96.png"
                                : getUser(reciver)[0].img
                        }
                        alt=""
                        className="avatar"
                    />
                    {reciver == "" ? "World" : getUser(reciver)[0].name}
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
                    <button type="submit" onClick={() => sendMsg(msg)}>
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
