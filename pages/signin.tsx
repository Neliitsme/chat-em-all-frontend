import Link from "next/link";
import FormInputField from "../components/FormInputField";
import PillButton from "../components/PillButton";

export default function SignIn() {
  function toggleMethod() {}
  function handleSignIn() {}

  return (
    <div className="flex h-screen place-content-center">
      <form
        className="border rounded-lg flex flex-col p-12 place-self-center place-items-center place-content-center space-y-4"
        action=""
      >
        <h1 className="">Sign in to</h1>
        <h1 className="font-bold italic text-3xl">Chat &apos;Em All</h1>
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
        <PillButton text={"Sign in"} onClick={handleSignIn} />
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
