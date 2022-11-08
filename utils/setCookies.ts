import Cookies from "universal-cookie";

export default function setCookies(headers: any) {
  const cookies = new Cookies();
  cookies.set("access_token", headers.access_token, { path: "/" });
}
