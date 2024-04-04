import { jwtDecode } from "jwt-decode";

const isLoggedIn = () => {
  const token = sessionStorage.getItem('token')
  if (!token) return false;
  try {
    return jwtDecode(token).exp > Date.now()/1000
  } catch {
    return false
  }
}

export default isLoggedIn