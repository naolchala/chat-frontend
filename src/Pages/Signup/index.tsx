import { Link } from "react-router-dom";
import "./signup.scss";
export function SignUp() {
    return (
        <div className="signUpPage">
            <div className="loginForm">
                <h1>Create Account</h1>
                <form action="">
                    <label>
                        <span className="label">Name</span>
                        <input type="text" name="username" id="" />
                        <span className="error">
                            Name should be at least 5 characters long
                        </span>
                    </label>

                    <label>
                        <span className="label">Email</span>
                        <input type="text" name="username" id="" />
                        <span className="error">Email Aleardy Exists</span>
                    </label>

                    <label>
                        <span className="label">Password</span>
                        <input type="text" name="username" id="" />
                        <span className="error">
                            Password should be at least 6 Characters
                        </span>
                    </label>

                    <label htmlFor="">
                        <span className="label">Confirm Password</span>
                        <input type="text" name="password" id="" />
                        <span className="error">Passwords Don't Match</span>
                    </label>

                    <button type="submit">Create Account</button>
                </form>

                <Link to={"/login"} className="link">
                    Already Have an Account
                </Link>
            </div>
        </div>
    );
}
