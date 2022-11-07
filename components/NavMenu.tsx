import { HiLogout } from "react-icons/hi";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";

export default function NavMenu() {
  const router = useRouter();

  function handleExit() {
    const cookies = new Cookies();
    cookies.remove("access_token", { path: "/" });
    cookies.remove("access_token_type", { path: "/" });
    router.push("/signin");
  }

  return (
    <ul className="absolute border-2 rounded-lg bottom-20 left-0 p-4 bg-zinc-800 border-amber-400">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleExit();
        }}
        className="flex text-red-500"
      >
        <HiLogout size={24} />
        <p className="mx-4">Sign out</p>
      </a>
    </ul>
  );
}
