import Link from "next/link";
import { useRouter } from "next/router";
import FormInputField from "../components/FormInputField";
import PillButton from "../components/PillButton";
import axios from "axios";
import { useState } from "react";
import ErrorBadge from "../components/ErrorBadge";
import setCookies from "../utils/setCookies";
import querystring from "querystring";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("undefined");
  const router = useRouter();

  function handleSignUp() {
    setShowError(false);
    setErrorText("undefined");

    if (!username.trim() || !password || !email.trim()) {
      setErrorText("Please fill the form.");
      setShowError(true);
      return;
    }

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/users/register`,
        {},
        {
          params: {
            username: username,
            email: email,
            password: password,
          },
        }
      )
      .then((res) => {
        axios
          .post(
            `${process.env.NEXT_PUBLIC_API_HOST}/api/users/token`,
            querystring.stringify({
              username: username.trim(),
              password: password,
            })
          )
          .then((res) => {
            setCookies(res.data);
            router.push("/");
          });
      })
      .catch((err) => {
        if (err?.response?.status === 409) {
          setErrorText("Username or email already exists.");
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
        <h1 className="">Sign up to</h1>
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
          label="Email"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            handleSignUp();
          }}
        >
          <PillButton text={"Sign up"} />
        </a>
        <p className="">
          Or{" "}
          <Link href="/signin" className="text-amber-500 hover:text-amber-600">
            sign in
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
