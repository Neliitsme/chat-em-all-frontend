import Cookies from "universal-cookie";

export default function removeCookies() {
  const cookies = new Cookies();
  cookies.remove("access_token");
}
