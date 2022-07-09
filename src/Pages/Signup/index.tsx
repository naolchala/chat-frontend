import axios from "axios";
import { Formik, FormikHandlers, FormikHelpers } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { apiUrl } from "../../lib/api";
import "./signup.scss";

const signupSchema = yup.object().shape({
	name: yup
		.string()
		.min(3, "Name should be at least 3 characters long")
		.required(),
	email: yup.string().email().required(),
	password: yup
		.string()
		.min(6, "Password should be at least 6 Characters")
		.max(32)
		.required(),
	confirmPass: yup
		.string()
		.oneOf([yup.ref("password")], "Passwords Must match"),
});

interface ISignUp {
	name: string;
	email: string;
	password: string;
	confirmPass: string;
}

export function SignUp() {
	const navigator = useNavigate();
	const handleSubmit = async (
		values: ISignUp,
		actions: FormikHelpers<ISignUp>
	) => {
		actions.setSubmitting(true);
		await axios
			.post(
				`${apiUrl}/auth/signUp`,
				{ ...values },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
			.then((res) => {
				// TODO: Automaticaly login
				navigator("/");
			})
			.catch((err) => {
				actions.setSubmitting(false);
				if (err.response.status == 403) {
					const { type, msg } = err.response.data;
					actions.setFieldError(type, msg);
				} else {
				}
			});
	};
	return (
		<div className="signUpPage">
			<div className="loginForm">
				<h1>Create Account</h1>
				<Formik
					onSubmit={handleSubmit}
					validationSchema={signupSchema}
					initialValues={{
						name: "",
						email: "",
						password: "",
						confirmPass: "",
					}}
				>
					{(_formik) => (
						<form onSubmit={_formik.handleSubmit}>
							<label>
								<span className="label">Name</span>
								<input
									type="text"
									value={_formik.values.name}
									onChange={_formik.handleChange}
									onBlur={_formik.handleBlur}
									name="name"
									id=""
								/>

								{_formik.touched.name &&
									_formik.errors.name && (
										<span className="error">
											{_formik.errors.name}
										</span>
									)}
							</label>

							<label>
								<span className="label">Email</span>
								<input
									value={_formik.values.email}
									onChange={_formik.handleChange}
									onBlur={_formik.handleBlur}
									type="email"
									name="email"
									id=""
								/>
								{_formik.touched.email &&
									_formik.errors.email && (
										<span className="error">
											{_formik.errors.email}
										</span>
									)}
							</label>

							<label>
								<span className="label">Password</span>
								<input
									value={_formik.values.password}
									onChange={_formik.handleChange}
									onBlur={_formik.handleBlur}
									type="password"
									name="password"
									id=""
								/>
								{_formik.touched.password &&
									_formik.errors.password && (
										<span className="error">
											{_formik.errors.password}
										</span>
									)}
								<span className="error"></span>
							</label>

							<label htmlFor="">
								<span className="label">Confirm Password</span>
								<input
									value={_formik.values.confirmPass}
									onChange={_formik.handleChange}
									onBlur={_formik.handleBlur}
									type="password"
									name="confirmPass"
									id=""
								/>
								{_formik.touched.confirmPass &&
									_formik.errors.confirmPass && (
										<span className="error">
											{_formik.errors.confirmPass}
										</span>
									)}
							</label>

							<button
								disabled={_formik.isSubmitting}
								type="submit"
							>
								{
									// TODO: Add spinner
								}
								{_formik.isSubmitting
									? "Creating... "
									: "Create Account"}
							</button>
						</form>
					)}
				</Formik>
				<Link to={"/login"} className="link">
					Already Have an Account
				</Link>
			</div>
		</div>
	);
}
