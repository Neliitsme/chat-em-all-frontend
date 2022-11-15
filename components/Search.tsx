import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { HiArrowUp } from "react-icons/hi";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { Dispatch, SetStateAction } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { resolveSoa } from "dns";
import removeCookies from "../utils/removeCookies";
import { useRouter } from "next/router";
import { ChatPreviewBody } from "../interfaces/ChatPreviewBody";
import { FoundUser } from "../interfaces/FoundUser";

interface SearchProps {
  foundUser: FoundUser[];
  setFoundUser: Dispatch<SetStateAction<FoundUser[]>>;
  activePage: string;
  setActivePage: Dispatch<SetStateAction<string>>;
  activeChat: ChatPreviewBody | null;
  setActiveChat: Dispatch<SetStateAction<ChatPreviewBody | null>>;
}

export default function Search({
  foundUser,
  setFoundUser,
  activePage,
  setActivePage,
  activeChat,
  setActiveChat,
}: SearchProps) {
  const router = useRouter();
  function handleStartChat() {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/chats/start_chat`,
        {},
        {
          headers: {
            Authorization: `Bearer ${new Cookies().get("access_token")}`,
          },
          params: {
            user_id: foundUser[0].id,
          },
        }
      )
      .then((res) => {
        setActiveChat({
          id: res.data.id,
          avatar: "/avatar.jpg",
          username: res.data.name,
          user_id: res.data.users_ids[0],
          latestMessage: res.data.messages[res.data.messages.length - 1].text,
        });
        setActivePage("chat");
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          removeCookies();
          router.push("/signin");
        }
        console.log(err);
      });
  }

  return (
    <>
      {foundUser.length > 0 ? (
        <>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleStartChat();
            }}
          >
            <div className="border-b-2 flex p-2 w-screen h-24">
              <div className="h-full w-20 relative">
                <Image
                  src={"/avatar.jpg"}
                  alt="Avatar"
                  fill
                  className="rounded-xl"
                />
              </div>
              <div className="mx-2 w-4/5">
                <p className="font-bold text-lg">{foundUser[0].username}</p>
                <p className="whitespace-normal line-clamp-2 text-zinc-300/40">
                  Tap to start a chat
                </p>
              </div>
            </div>
          </a>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
