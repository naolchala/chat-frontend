import React, { useRef, useState } from "react";
import { MdArrowBack, MdMenu, MdSend } from "react-icons/md";
import { animated, useSpring } from "react-spring";
import { Message } from "../../Message";
import { useSettings } from "../../States/Settings";
import { useUser } from "../../States/User";

export const TextContainer = () => {
    const user = useUser((state) => state.selectedUser);
    const menuOpen = useSettings((state) => state.menuOpen);
    const toggleMenu = useSettings((state) => state.toggleMenu);
    const [msg, setMsg] = useState("");
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
                <img src={user.photoUrl} alt="" className="avatar" />
                {user.name}
            </div>
            <div className="txtContainer">
                {/* {reciver == "" ? (
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
                )} */}
                <div ref={dummyBottom} className="dummyBottom"></div>
            </div>
            <form className="messageForm" onSubmit={() => {}}>
                <input
                    placeholder="Message"
                    type={"text"}
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                ></input>
                <button type="submit" onClick={() => {}}>
                    <MdSend />
                </button>
            </form>
        </div>
    );
};
