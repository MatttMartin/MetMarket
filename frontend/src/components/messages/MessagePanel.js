import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import classes from "./MessagePanel.module.css";
import io from "socket.io-client";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { parseISO, compareAsc } from "date-fns";
import { Link, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaArrowLeft } from "react-icons/fa";

function useChatScroll(dep) {
	const ref = React.useRef();
	React.useEffect(() => {
		if (ref.current) {
			ref.current.scrollTop = ref.current.scrollHeight;
		}
	}, [dep]);
	return ref;
}

const MessagePanel = () => {
	const [newMessage, setNewMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [conversations, setConversations] = useState([]);
	const [selectedConversation, setSelectedConversation] = useState(null);
	const [userData, setUserData] = useState(null);
	const [socket, setSocket] = useState(null);
	const [alreadyFetched, setAlreadyFetched] = useState(false);
	const { id } = useParams();

	const chatContainerRef = useChatScroll(messages);

	useEffect(() => {
		const newSocket = io(process.env.REACT_APP_APIURL, {
			query: {
				userId: jwtDecode(sessionStorage.getItem("token")).id,
			},
		});

		newSocket.on("confirmation", (msg) => {
			console.log(msg);
		});

		newSocket.on("newMessage", (msg) => {
			console.log(msg);
			setMessages((prevMessages) => [...prevMessages, msg]);
		});

		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, [jwtDecode(sessionStorage.getItem("token")).id]);

	useEffect(() => {
		console.log("backend url: ", process.env.REACT_APP_APIURL)
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
				setUserData(response.data[0]);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchUserData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [conversationsResponse, messagesResponse] = await Promise.all([
					axios.get(process.env.REACT_APP_APIURL + "/messages/conversations", {
						headers: {
							authorization: sessionStorage.getItem("token"),
						},
						params: {
							signedInUserID: jwtDecode(sessionStorage.getItem("token")).id,
						},
					}),
					axios.get(process.env.REACT_APP_APIURL + "/messages/messages", {
						headers: {
							authorization: sessionStorage.getItem("token"),
						},
						params: {
							signedInUserID: jwtDecode(sessionStorage.getItem("token")).id,
						},
					}),
				]);
				setAlreadyFetched(true);
				setMessages(messagesResponse.data);
				setConversations(conversationsResponse.data);
				console.log("from db: ", conversationsResponse.data);
				// let conversationsToAdd = conversationsResponse.data.filter(
				// 	(newConvo) => !conversations.some((existingConvo) => existingConvo.product_id === newConvo.product_id)
				// );

				if (id) {
					const foundConvo = conversationsResponse.data.find((convo) => convo.product_id === id);

					if (!foundConvo) {
						const response = await axios.post(
							process.env.REACT_APP_APIURL + "/messages/conversations",
							{
								product_id: id,
								userid: jwtDecode(sessionStorage.getItem("token")).id,
							},
							{
								headers: {
									authorization: sessionStorage.getItem("token"),
								},
							}
						);
						const newConvo = response.data;

						setConversations([...conversationsResponse.data, newConvo]);

						setSelectedConversation(newConvo);
					} else {
						setSelectedConversation(foundConvo);
					}
				} else {
					// setSelectedConversation(
					// 	window.innerWidth >= 764
					// 		? [...conversations, ...conversationsToAdd].sort(
					// 				(b, a) =>
					// 					new Date(
					// 						messagesResponse.data
					// 							.filter((message) => message.conversation_id === a.conversation_id)
					// 							.sort((b, a) => compareAsc(parseISO(a.time_stamp), parseISO(b.time_stamp)))[0].time_stamp
					// 					) -
					// 					new Date(
					// 						messagesResponse.data
					// 							.filter((message) => message.conversation_id === b.conversation_id)
					// 							.sort((b, a) => compareAsc(parseISO(a.time_stamp), parseISO(b.time_stamp)))[0].time_stamp
					// 					)
					// 		  )[0]
					// 		: null
					// );

					setSelectedConversation(window.innerWidth >= 764 ? conversationsResponse.data[0] : null);
				}

				setLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error);
				setLoading(false);
			}
		};
		if (userData && !alreadyFetched) {
			setAlreadyFetched(true);
			fetchData();
		}
	}, [userData]);

	const handleConversationSelect = (conversation) => {
		setSelectedConversation(conversation);
	};

	const latestMessage = (conversation) => {
		let conversationMessages = messages.filter((message) => message.conversation_id === conversation.conversation_id);
		return conversationMessages.sort((a, b) => compareAsc(parseISO(a.time_stamp), parseISO(b.time_stamp)))[
			conversationMessages.length - 1
		];
	};

	const otherUsersName = (conversation) => {
		return conversation.userid1 === jwtDecode(sessionStorage.getItem("token")).id
			? conversation.user2_first_name + " " + conversation.user2_last_name
			: conversation.user1_first_name + " " + conversation.user1_last_name;
	};

	const sendMessage = async () => {
		if (newMessage.trim() === "") return;
		try {
			const response = await axios.post(
				process.env.REACT_APP_APIURL + "/messages/messages",
				{
					conversation_id: selectedConversation.conversation_id,
					message: newMessage,
					senderID: jwtDecode(sessionStorage.getItem("token")).id,
					recieverID:
						jwtDecode(sessionStorage.getItem("token")).id === selectedConversation.userid1
							? selectedConversation.userid2
							: selectedConversation.userid1,
				},
				{
					headers: {
						authorization: sessionStorage.getItem("token"),
					},
				}
			);
		} catch (error) {
			console.error("Error uploading message:", error);
		}

		const message = {
			conversation_id: selectedConversation.conversation_id,
			message: newMessage,
			message_id: uuidv4().toString(),
			receiver_first_name:
				selectedConversation.userid1 === jwtDecode(sessionStorage.getItem("token")).id
					? selectedConversation.user2_first_name
					: selectedConversation.user1_first_name,
			receiver_id:
				jwtDecode(sessionStorage.getItem("token")).id === selectedConversation.userid1
					? selectedConversation.userid2
					: selectedConversation.userid1,
			receiver_last_name:
				selectedConversation.userid1 === jwtDecode(sessionStorage.getItem("token")).id
					? selectedConversation.user2_last_name
					: selectedConversation.user1_last_name,
			sender_first_name: userData.first_name,
			sender_id: jwtDecode(sessionStorage.getItem("token")).id,
			sender_last_name: userData.last_name,
			time_stamp: new Date().toISOString(),
		};

		socket.emit("message", message);
		setMessages([...messages, message]);
		setNewMessage("");
	};

	const [screenSize, setScreenSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const cropContent = (content, maxLength) => {
		return content?.length > maxLength ? content.slice(0, maxLength) + "..." : content;
	};

	useEffect(() => {
		const handleResize = () => {
			setScreenSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
			if (window.innerWidth >= 763 && !selectedConversation && conversations.length > 0) {
				setSelectedConversation(conversations[0]);
			}
		};

		window.addEventListener("resize", handleResize);

		// Clean up the event listener when the component unmounts
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [conversations, selectedConversation]);

	return (
		<>
			{loading ? (
				<div>Loading...</div>
			) : (
				<div className="container-fluid">
					<div className="row">
						<div className={`${screenSize.width >= 768 ? "col-md-3" : selectedConversation ? "d-none" : "col-md-12"}`}>
							<h2>Conversations</h2>
							<div className={classes.listGroupContainer}>
								<ul className="list-group">
									{conversations
										.sort((a, b) => new Date(latestMessage(b)?.time_stamp) - new Date(latestMessage(a)?.time_stamp))
										.map((conversation) => (
											<li
												key={conversation.conversation_id}
												className={`list-group-item ${
													selectedConversation?.conversation_id === conversation.conversation_id ? classes.active : ""
												}`}
												onClick={() => handleConversationSelect(conversation)}
											>
												<div>
													<strong>{`${otherUsersName(conversation)} - ${conversation.product_title}`}</strong>
												</div>
												<div className="latest-message">{cropContent(latestMessage(conversation)?.message, 80)}</div>
											</li>
										))}
								</ul>
							</div>
						</div>
						<div
							className={`${
								selectedConversation && screenSize.width <= 767 ? "col-md-12" : "col-md-9 d-none d-md-block"
							}`}
						>
							{selectedConversation ? (
								<div className={classes.header}>
									{screenSize.width <= 767 && (
										<button
											className="btn btn-secondary"
											onClick={() => {
												setSelectedConversation(null);
											}}
										>
											<FaArrowLeft />
										</button>
									)}
									<h2>{otherUsersName(selectedConversation) + "  -  " + selectedConversation.product_title}</h2>
									<Link to={"/adDetails/" + selectedConversation.product_id}>
										<button className="btn btn-primary">View Item Details</button>
									</Link>
								</div>
							) : (
								<div className={classes.header}>
									<h2>No Messages to Display</h2>
								</div>
							)}
							<div className={classes.messagingPanel}>
								{selectedConversation && (
									<div ref={chatContainerRef} className={classes.messageContainer}>
										{messages
											.filter((message) => message.conversation_id === selectedConversation.conversation_id)
											.sort((a, b) => new Date(a.time_stamp) - new Date(b.time_stamp))
											.map((message) => (
												<div key={message.message_id}>
													<p>
														<strong>{message.sender_first_name}:</strong> {message.message}
													</p>
												</div>
											))}
									</div>
								)}
								{selectedConversation && (
									<div className={`input-group mt-3 ${classes.inputGroup}`}>
										<input
											type="text"
											className="form-control"
											placeholder="Type your message here..."
											value={newMessage}
											onChange={(e) => {
												if (selectedConversation) {
													setNewMessage(e.target.value);
												}
											}}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													sendMessage();
												}
											}}
										/>
										<div className="input-group-append">
											<button className="btn btn-primary" onClick={sendMessage}>
												Send
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default MessagePanel;
