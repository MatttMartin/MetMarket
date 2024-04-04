import axios from "axios";
import { jwtDecode } from "jwt-decode";

const isAdmin = async () => {
  console.log("in is admin. token: ", sessionStorage.getItem("token"))
  try {
    console.log("in isadmin top of try")
    const response = await axios.get(process.env.REACT_APP_APIURL + "/profile/details", {
      headers: {
        authorization: sessionStorage.getItem("token"),
      },
      params: {
        signedInUserID: jwtDecode(sessionStorage.getItem("token")).id,
      },
    });
    console.log("in isadmin:", response.data[0].is_admin, parseInt(response.data[0].is_admin))
    return response.data.length > 0 && parseInt(response.data[0].is_admin)
  } catch (error) {
    console.log("in isadmin error")
    return false
  }
}

export default isAdmin
