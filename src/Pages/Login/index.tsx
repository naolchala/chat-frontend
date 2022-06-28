import axios from "axios";
import { Formik, FormikHelpers } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { IUser, IUserState, useUser } from "../../States/User";
import "./login.scss";

const loginSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
});

interface ILogin {
    email: string;
    password: string;
}

export const apiUrl = "http://localhost:5000";

export function Login() {
    const user = useUser((state) => state.currentUser);
    const setUser = useUser((state) => state.setUser);

    const navigate = useNavigate();

    const handleSubmit = async (
        values: ILogin,
        actions: FormikHelpers<ILogin>
    ) => {
        const { email, password } = values;
        actions.setSubmitting(true);
        await axios
            .post(
                `${apiUrl}/auth/login`,
                { email, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                const user = res.data;
                window.localStorage.setItem("user", JSON.stringify(user));
                setUser(user);
                actions.setSubmitting(false);
                navigate("/chat");
                // TODO: STORE Token in Cookies
            })
            .catch((err) => {
                const { type, msg } = err.response.data;
                actions.setSubmitting(false);
                actions.setFieldError(type, msg);
            });
    };

    return (
        <div className="loginPage">
            <div className="loginForm">
                <h1>Login</h1>
                <Formik
                    onSubmit={handleSubmit}
                    validationSchema={loginSchema}
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                >
                    {(_formik) => (
                        <form onSubmit={_formik.handleSubmit}>
                            <label htmlFor="email">
                                <span className="label">Email</span>
                                <input
                                    type="text"
                                    value={_formik.values.email}
                                    onChange={_formik.handleChange}
                                    onBlur={_formik.handleBlur}
                                    name="email"
                                    id="email"
                                    disabled={_formik.isSubmitting}
                                />
                                {_formik.touched.email &&
                                    _formik.errors.email && (
                                        <span className="error">
                                            {_formik.errors.email}
                                        </span>
                                    )}
                            </label>

                            <label htmlFor="password">
                                <span className="label">Password</span>
                                <input
                                    value={_formik.values.password}
                                    onChange={_formik.handleChange}
                                    onBlur={_formik.handleBlur}
                                    type="password"
                                    name="password"
                                    id="password"
                                    disabled={_formik.isSubmitting}
                                />
                                {_formik.touched.password &&
                                    _formik.errors.password && (
                                        <span className="error">
                                            {_formik.errors.password}
                                        </span>
                                    )}
                            </label>
                            <button
                                disabled={_formik.isSubmitting}
                                type="submit"
                            >
                                {_formik.isSubmitting
                                    ? "Authenticating... "
                                    : "Login"}
                            </button>
                        </form>
                    )}
                </Formik>

                <Link to={"/signup"} className="link">
                    Create Account
                </Link>
            </div>
        </div>
    );
}
