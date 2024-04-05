import axios from "axios";
import { jwtDecode } from "jwt-decode";

const isAdmin = async () => {
  try {
    const response = await axios.get(process.env.REACT_APP_APIURL + "/profile/details", {
      headers: {
        authorization: sessionStorage.getItem("token"),
      },
      params: {
        signedInUserID: jwtDecode(sessionStorage.getItem("token")).id,
      },
    });
    return response.data.length > 0 && parseInt(response.data[0].is_admin)
  } catch (error) {
    console.log("in isadmin error")
    return false
  }
}

export default isAdmin
