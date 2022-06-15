import { FC } from "react";
import { useSpring, animated } from "react-spring";

interface IMessage {
    message: any;
}

export const Message: FC<IMessage> = ({ message }) => {
    const me = window.sessionStorage.getItem("id");
    const props = useSpring({
        from: {
            opacity: 0,
            top: 10,
        },
        to: {
            opacity: 1,
            top: 0,
        },
    });
    return (
        <animated.div
            style={props}
            className={`message ${message.sender.id == me ? "mine" : ""}`}
        >
            <img src={message.sender.img} alt={message.sender.name} />
            <span>{message.msg}</span>
        </animated.div>
    );
};
