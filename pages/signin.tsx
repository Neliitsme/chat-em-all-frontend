import Link from "next/link";
import FormInputField from "../components/FormInputField";
import PillButton from "../components/PillButton";
import { useRouter } from "next/router";
import { useState } from "react";
import ErrorBadge from "../components/ErrorBadge";
import axios from "axios";
import querystring from "querystring";
import Cookies from "universal-cookie";

export default function SignIn() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("undefined");
  const router = useRouter();

  function handleSignIn() {
    setShowError(false);
    setErrorText("undefined");
    const cookies = new Cookies();
    cookies.remove("access_token");

    if (!username.trim() || !password) {
      setErrorText("Please enter a username and password.");
      setShowError(true);
      return;
    }

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/users/token`,
        querystring.stringify({ username: username.trim(), password: password })
      )
      .then((res) => {
        cookies.set("access_token", res.data.access_token, { path: "/" });
        router.push("/");
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          setErrorText("Incorrect username or password.");
        } else {
          setErrorText("An error occurred. Please try again.");
        }
        setShowError(true);
        console.log(err);
      });
  }

  return (
    <div className="flex h-screen place-content-center">
      <form
        className="border drop-shadow-md rounded-lg flex flex-col p-12 place-self-center place-items-center place-content-center space-y-4"
        action=""
      >
        <h1 className="">Sign in to</h1>
        <h1 className="font-bold italic text-3xl">Chat &apos;Em All</h1>
        {showError && <ErrorBadge text={errorText} />}
        <FormInputField
          label="Username"
          type="text"
          placeholder="WackyNerdEmoji_985"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormInputField
          label="Password"
          type="password"
          placeholder="*******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
        >
          <PillButton text={"Sign in"} />
        </a>
        <p className="">
          Or{" "}
          <Link href="/signup" className="text-amber-500 hover:text-amber-600">
            sign up
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
