// Libraries
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Components
import AdDetails from "./pages/ads/adDetails";
import PageNotFound from "./pages/pageNotFound";
import Navbar from "./components/navbars/Navbar.js";
import AdForm from "./pages/ads/adForm.js";
import HomePage from "./pages/ads/homePage.js";
import MessagePanel from "./components/messages/MessagePanel.js";
import MyAccount from "./components/profile/MyAccount.js";
import MyListings from "./components/profile/MyListings.js";
import AdminPanel from "./pages/admin/ReportedAds.js";
import ReportedUsers from "./pages/admin/ReportedUsers.js";
import ManageUsers from "./pages/admin/ManageUsers.js";
import SignUp from "./components/login/SignUp.js";
import ForbiddenPage from "./pages/forbiddenPage.js";

// Styling
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./App.css";

function App() {
	// This is meant to mock an existing ad, will be replaced when developing the backend
	var vals = {
		title: "title 11",
		price: 10,
		description: "description 1",
		category: 1,
		images: [],
		onCampus: false,
		street: "street 1",
		city: "city 1",
		country: "country 1",
		isAvailable: true,
	};

	return (
			<Router>
				<div>
					<Navbar />
					<Routes>
						{/* Add the actual main page once you have it */}
						<Route path="/" element={<HomePage />} />
						<Route path="/AdDetails/:id" element={<AdDetails />} />
						<Route path="/search" element={<HomePage />} />
						<Route path="&filters" element={<HomePage />} />
						<Route path="/NewAd" element={<AdForm isEditForm={false}/>} />
						<Route path="/EditAd/:id" element={<AdForm vals={vals} isEditForm={true} />} />
						<Route path="/Messages/:id" element={<MessagePanel />} />
						<Route path="/Messages" element={<MessagePanel />} />
						<Route path="/MyAccount" element={<MyAccount />} />
						<Route path="/MyListings" element={<MyListings />} />
						<Route path="/AdminPanel" element={<AdminPanel />} />
						<Route path="/AdminPanel/ReportedAds" element={<AdminPanel />} />
						<Route path="/AdminPanel/ReportedUsers" element={<ReportedUsers />} />
						<Route path="/AdminPanel/ManageUsers" element={<ManageUsers />} />
						<Route path="/login" element={<SignUp isLogin={true} />} />
						<Route path="/signup" element={<SignUp isLogin={false} />} />
						<Route path="/forbidden" element={<ForbiddenPage />} />
						<Route path="*" element={<PageNotFound />} />
					</Routes>
					{/* Add the componenet once you have it
			<Footer />
      */}
				</div>
			</Router>
	);
}

export default App;
