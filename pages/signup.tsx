import Link from "next/link";
import { useRouter } from "next/router";
import FormInputField from "../components/FormInputField";
import PillButton from "../components/PillButton";

export default function SignUp() {
  const router = useRouter();
  function handleSignUp() {}
  return (
    <div className="flex h-screen place-content-center">
      <form
        className="border drop-shadow-md rounded-lg flex flex-col p-12 place-self-center place-items-center place-content-center space-y-4"
        action=""
      >
        <h1 className="">Sign up to</h1>
        <h1 className="font-bold italic text-3xl">Chat &apos;Em All</h1>
        <FormInputField
          label="Username"
          type="text"
          placeholder="WackyNerdEmoji_985"
        />
        <FormInputField
          label="Email"
          type="email"
          placeholder="example@email.com"
        />
        <FormInputField
          label="Password"
          type="password"
          placeholder="*******"
        />
        <Link href="/">
          <PillButton text={"Sign up"} clickFn={handleSignUp} />
        </Link>
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
