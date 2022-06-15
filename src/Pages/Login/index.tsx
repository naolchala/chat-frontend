import { Link } from "react-router-dom";
import "./login.scss";
export function Login() {
    return (
        <div className="loginPage">
            <div className="loginForm">
                <h1>Login</h1>
                <form action="">
                    <label htmlFor="">
                        <span className="label">Email</span>
                        <input type="text" name="username" id="" />
                        <span className="error">User not found</span>
                    </label>

                    <label htmlFor="">
                        <span className="label">Password</span>
                        <input type="text" name="password" id="" />
                        <span className="error">Incorrect Password</span>
                    </label>

                    <button type="submit">Login</button>
                </form>

                <Link to={"/signup"} className="link">
                    Create Account
                </Link>
            </div>
        </div>
    );
}
