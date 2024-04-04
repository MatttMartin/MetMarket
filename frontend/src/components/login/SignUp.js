import React, { useState } from "react";
import classes from "./SignUp.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = (props) => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (props.isLogin) {
			try {
				const response = await axios.post(
					process.env.REACT_APP_APIURL + "/profile/login",
					{
						email,
						password,
					}
				);
				sessionStorage.setItem("token", response.data.token);
				navigate("/");
			} catch (error) {
				alert(error.response.data.error);
			}
		} else {
			const emailRegex = /\S+@\S+\.\S+/;
			const phoneRegex = /^[+]?[(]?[0-9]{1,3}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{4,6}$/im;

			if (!emailRegex.test(email)) {
				alert("Please enter a valid email address.");
				return;
			}

			if (!phoneRegex.test(phoneNumber)) {
				alert("Please enter a valid phone number.");
				return;
			}

			if (password.length < 6) {
				alert("Password must be at least 6 characters long.");
				return;
			}

			if (password !== confirmPassword) {
				alert("Passwords do not match.");
				return;
			}

			try {
				const response = await axios.post(
					process.env.REACT_APP_APIURL + "/profile",
					{
						firstName,
						lastName,
						email,
						phoneNumber,
						password,
					}
				);
				sessionStorage.setItem("token", response.data.token);
				navigate("/");
			} catch (error) {
				alert(error.response.data.error);
			}
		}
	};

	return (
		<div className={`container ${classes.SignUpContainer}`}>
			<form className={classes.SignUpForm} onSubmit={handleSubmit}>
				{!props.isLogin ? (
					<>
						<h2>Sign Up</h2>
						<div className="row">
							<div className="col-md-6 mb-3">
								<label htmlFor="firstName" className="form-label">
									First Name
								</label>
								<input
									type="text"
									className="form-control"
									id="firstName"
									name="firstName"
									required
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
								/>
							</div>
							<div className="col-md-6 mb-3">
								<label htmlFor="lastName" className="form-label">
									Last Name
								</label>
								<input
									type="text"
									className="form-control"
									id="lastName"
									name="lastName"
									required
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
								/>
							</div>
						</div>
						<div className="mb-3">
							<label htmlFor="email" className="form-label">
								Email
							</label>
							<input
								type="email"
								className="form-control"
								id="email"
								name="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="phoneNumber" className="form-label">
								Phone Number
							</label>
							<input
								type="tel"
								className="form-control"
								id="phoneNumber"
								name="phoneNumber"
								required
								value={phoneNumber}
								onChange={(e) => setPhoneNumber(e.target.value)}
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="password" className="form-label">
								Create Password
							</label>
							<input
								type="password"
								className="form-control"
								id="password"
								name="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								minLength="6"
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="confirmPassword" className="form-label">
								Confirm Password
							</label>
							<input
								type="password"
								className="form-control"
								id="confirmPassword"
								name="confirmPassword"
								required
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</div>
					</>
				) : (
					<>
						<h2>Log In</h2>
						<div className="mb-3">
							<label htmlFor="email" className="form-label">
								Email
							</label>
							<input
								className="form-control"
								id="email"
								name="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="password" className="form-label">
								Password
							</label>
							<input
								type="password"
								className="form-control"
								id="password"
								name="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</>
				)}

				<div className="text-center">
					<button type="submit" className="btn btn-primary">
						Submit
					</button>
				</div>
			</form>
		</div>
	);
};

export default SignUp;
