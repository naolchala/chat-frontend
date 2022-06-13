import {
    EventHandler,
    FormEventHandler,
    useEffect,
    useLayoutEffect,
    useState,
} from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:4000", {
    // autoConnect: false,
});

function App() {
    const [msg, setMessage] = useState("");
    const [chat, setChat] = useState([] as any[]);
    const [privateMsg, setPrivateMsg] = useState([] as any[]);
    const [users, setUsers] = useState([] as any[]);
    const [reciver, setReciver] = useState("");

    const me = window.sessionStorage.getItem("id");

    const disconnect = () => {
        socket.disconnect();
    };
    const connect = () => socket.connect();
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
    };

    const sendToSingle = () => {
        socket.emit("msgTo", {
            id: window.sessionStorage.getItem("id"),
            reciver,
            msg,
        });
    };

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

    return (
        <div className="App">
            <button onClick={connect}>Connect</button>
            <button onClick={disconnect}>Disconnect</button>
            <br></br>
            <form onSubmit={sendMsg}>
                To: {reciver}
                <br />
                <input
                    type={"text"}
                    value={msg}
                    onChange={(e) => setMessage(e.target.value)}
                ></input>
                <button type="submit" onClick={() => sendMsg(msg)}>
                    Send
                </button>
            </form>

            <div className="container">
                <div>
                    {users.map((u) => (
                        <button
                            disabled={u.id == me}
                            onClick={() => setReciver(u.id)}
                        >
                            {u.name}
                        </button>
                    ))}
                </div>
                <div>
                    {chat.map((c) => (
                        <div>
                            <i>{c.id}</i>
                            <br></br>
                            {c.msg}
                        </div>
                    ))}
                </div>
                <div>
                    {privateMsg.map((c) => (
                        <div>
                            <i>from {c.sender}</i> <br></br>
                            <i>to: {c.id}</i>
                            <br></br>
                            {c.msg}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
