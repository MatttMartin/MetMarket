import React, { useState, useEffect } from "react";
import classes from "./MyAccount.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

var rawImageFiles = [];

const MyAccount = (props) => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [loading, setLoading] = useState(true);
	const [imageFiles, setImageFiles] = useState([]);
	const [isImageSelected, setIsImageSelected] = useState(false);
	const [initialProfilePic, setInitialProfilePic] = useState();
	const [imageLinks, setImageLinks] = useState([]);
	const fileInputRef = React.useRef();

	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axios.get(process.env.REACT_APP_APIURL + "/profile/details", {
					headers: {
						authorization: sessionStorage.getItem("token"),
					},
					params: {
						signedInUserID: jwtDecode(sessionStorage.getItem("token")).id,
					},
				});
				setEmail(response.data[0].email);
				setFirstName(response.data[0].first_name);
				setLastName(response.data[0].last_name);
				setPhoneNumber(response.data[0].phone_number);
				setInitialProfilePic(response.data[0].profile_picture_link);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching user data:", error);
				setLoading(false);
			}
		};

		fetchUserData();
	}, []);

	const handleDetailsSubmit = async (event) => {
		event.preventDefault();

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

		try {
			await axios.put(
				process.env.REACT_APP_APIURL + "/profile/update",
				{
					id: jwtDecode(sessionStorage.getItem("token")).id,
					first_name: firstName,
					last_name: lastName,
					email: email,
					phone_number: phoneNumber,
				},
				{
					headers: {
						authorization: `${sessionStorage.getItem("token")}`,
					},
				}
			);
		} catch (error) {
			alert("Failed to save changes");
			return;
		}
		alert("Successfully updated profile");
	};

	const handlePasswordSubmit = async (event) => {
		event.preventDefault();

		if (newPassword.length < 6) {
			alert("Password must be at least 6 characters long.");
			return;
		}

		if (newPassword !== confirmNewPassword) {
			alert("Passwords do not match.");
			return;
		}

		try {
			await axios.put(
				process.env.REACT_APP_APIURL + "/profile/newPassword",
				{
					id: jwtDecode(sessionStorage.getItem("token")).id,
					currentPassword: currentPassword,
					newPassword: newPassword,
				},
				{
					headers: {
						authorization: `${sessionStorage.getItem("token")}`,
					},
				}
			);
		} catch (error) {
			alert(error.response.data.error);
			return;
		}
		alert("Successfully updated password");
	};

	async function fileUpload(event) {
		if (!event.target.files || !window.FileReader) return;

		var files = event.target.files;
		rawImageFiles.push(...files);

		var filesArr = Array.prototype.slice.call(files);

		await setImageFiles([...imageFiles, ...filesArr]);
		setIsImageSelected(true);
	}

	useEffect(() => {
		if (imageFiles.length > 0) {
			const file = imageFiles[0];
			if (!file.type.match("image.*")) {
				console.error("Selected file is not an image.");
				return;
			}

			const reader = new FileReader();
			reader.onload = function (event) {
				const profilePic = document.querySelector("#profilePic");
				if (profilePic) {
					profilePic.src = event.target.result;
				}
			};
			reader.readAsDataURL(file);
		} else {
			const profilePic = document.querySelector("#profilePic");
			if (profilePic) {
				profilePic.src = initialProfilePic;
			}
		}
	}, [imageFiles, initialProfilePic]);

	const convertBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);

			fileReader.onload = () => {
				resolve(fileReader.result);
			};

			fileReader.onerror = (error) => {
				reject(error);
			};
		});
	};

	const postImage = async (base64) => {
		try {
			await axios.put(
				process.env.REACT_APP_APIURL + "/profile/profilepic",
				{
					id: jwtDecode(sessionStorage.getItem("token")).id,
					image: base64,
				},
				{
					headers: {
						authorization: `${sessionStorage.getItem("token")}`,
					},
				}
			);
		} catch (error) {
			alert("Failed to upload image");
			return;
		}
		alert("Successfully updated profile picture");
	};

	return (
		<>
			{loading ? (
				<div>Loading...</div>
			) : (
				<div className="container mt-3 mb-3">
					<div className="row">
						<div className="col-md-4 mb-3">
							{/* First Div */}
							<form onSubmit={handleDetailsSubmit} className="bg-light p-3 border rounded">
								{/* Form fields */}
								<h2>Edit Account Details</h2>
								<div className="mb-3">
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

								<div className="mb-3">
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
								<div className="text-center">
									<button type="submit" className="btn btn-primary">
										Submit
									</button>
								</div>
							</form>
						</div>
						<div className="col-md-4 mb-3">
							{/* First Div */}
							<form onSubmit={handlePasswordSubmit} className="bg-light p-3 border rounded">
								{/* Form fields */}
								<h2>Change Password</h2>
								<div className="mb-3">
									<label htmlFor="password" className="form-label">
										Current Password
									</label>
									<input
										type="password"
										className="form-control"
										id="currentPassword"
										name="currentPassword"
										required
										value={currentPassword}
										onChange={(e) => setCurrentPassword(e.target.value)}
										minLength="6"
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="password" className="form-label">
										New Password
									</label>
									<input
										type="password"
										className="form-control"
										id="newPassword"
										name="newPassword"
										required
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										minLength="6"
									/>
								</div>

								<div className="mb-3">
									<label htmlFor="confirmPassword" className="form-label">
										Confirm New Password
									</label>
									<input
										type="password"
										className="form-control"
										id="confirmNewPassword"
										name="confirmNewPassword"
										required
										value={confirmNewPassword}
										onChange={(e) => setConfirmNewPassword(e.target.value)}
									/>
								</div>
								<div className="text-center">
									<button type="submit" className="btn btn-primary">
										Submit
									</button>
								</div>
							</form>
						</div>
						<div className="col-md-4 mb-3">
							<div className="d-flex flex-column align-items-center bg-light p-3 border rounded">
								<h2>Update Profile Picture</h2>
								<img
									src={imageLinks.length > 0 ? imageLinks[0] : initialProfilePic}
									alt="Profile Pic"
									className={`${classes.profilePicture} mb-3`}
									id="profilePic"
								/>
								<input
									onChange={(event) => {
										fileUpload(event);
									}}
									className="form-control bg-body-tertiary"
									type="file"
									ref={fileInputRef}
									id="formFile"
									accept=".jpg,.png"
									required
									name="images"
								/>
								{isImageSelected && (
									<div className="d-flex justify-content-center mt-3">
										<button
											className="btn btn-primary me-2"
											onClick={async () => {
												const base64 = await convertBase64(rawImageFiles[0]);
												await postImage(base64);
											}}
										>
											Save
										</button>
										<button
											className="btn btn-secondary"
											onClick={() => {
												setIsImageSelected(false);
												setImageFiles([]);
												rawImageFiles = [];
												if (fileInputRef.current) {
													fileInputRef.current.value = "";
												}
											}}
										>
											Cancel
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
					<div className="row mt-3">
						<div className="col text-center">
							<button
								className="btn btn-danger"
								onClick={() => {
									sessionStorage.setItem("token", "");
									navigate("/");
								}}
							>
								Log Out
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default MyAccount;
