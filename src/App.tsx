import { Route, Routes } from "react-router-dom";
import { Chat } from "./Pages/Chat";
import "./App.scss";
import { Login } from "./Pages/Login";
import { SignUp } from "./Pages/Signup";

function App() {
    return (
        <Routes>
            <Route path="chat" element={<Chat />}></Route>
            <Route path="login" element={<Login />}></Route>
            <Route path="signup" element={<SignUp />}></Route>
        </Routes>
    );
}
export default App;
