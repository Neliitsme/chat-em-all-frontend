import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { HiArrowLeft, HiArrowUp } from "react-icons/hi";
import Image from "next/image";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import MessageOption from "../components/MessageOption";
import Message from "../components/Message";
import { ChatPreviewBody, Me } from ".";
import axios from "axios";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import removeCookies from "../utils/removeCookies";

export interface ChatMessagesResponseBody {
  messages: [
    {
      // TODO: would be nice to have
      // id: string;
      // date: string;
      text: string;
      owner_id: string;
    }
  ];
}

interface ChatProps {
  activeChat: ChatPreviewBody | null;
  setActiveChat: Dispatch<SetStateAction<ChatPreviewBody | null>>;
  activePage: string;
  setActivePage: Dispatch<SetStateAction<string>>;
  me: Me;
}

export default function Chat({
  activeChat,
  setActiveChat,
  activePage,
  setActivePage,
  me,
}: ChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_HOST}/api/chats/get_history`, {
        params: {
          chat_id: activeChat?.id,
        },
        headers: {
          Authorization: `Bearer ${new Cookies().get("access_token")}`,
        },
      })
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          removeCookies();
          router.push("/signin");
        }
        console.log(err);
      });

    bottomRef.current?.scrollIntoView();
  }, [activeChat?.id, router]);

  function handleCloseChat() {
    setActivePage("main");
    setActiveChat(null);
  }

  function displayMessages() {
    return messages.map((message) => {
      return <Message props={message} me={me} />;
    });
  }

  return (
    <div>
      <div className="fixed p-2 top-0 inset-x-0 bg-zinc-800 z-10 drop-shadow-md">
        <div className="flex h-12">
          <a
            href="#"
            className="flex my-3"
            onClick={(e) => {
              e.preventDefault();
              handleCloseChat();
            }}
          >
            <HiArrowLeft size={24} />
            <p className="mr-6">Back</p>
          </a>
          <Link href={""} className="flex">
            <div className="relative w-12">
              <Image src={"/avatar.jpg"} alt="" fill className="rounded-xl" />
            </div>
            <p className="font-bold text-lg m-2 mx-4">{activeChat?.username}</p>
          </Link>
        </div>
      </div>

      <div className="h-screen w-screen flex items-end pt-16 overflow-clip">
        <ul className="h-full w-screen flex flex-col last:pb-48 overflow-auto">
          {displayMessages()}
          <div ref={bottomRef} />
        </ul>
      </div>

      <div className="flex fixed bottom-0 inset-x-0 h-48 gap-4 px-2 py-2 items-end overflow-x-scroll z-10">
        <MessageOption
          emotion="😀"
          message="My name is Yoshikage Kira. I'm 33 years old. My house is in the northeast section of Morioh, where all the villas are, and I am not married."
        />
        <MessageOption emotion="🫤" message="Hello stranger" />
        <MessageOption
          emotion="😶"
          message="Stop! You have violated the Law! Pay the court a fine or serve your sentance. Your stolen goods are now forfeit"
        />
        <MessageOption
          emotion="😎"
          message="im swaggin im cool wassup"
          blurred
        />
      </div>

      {/* <form className="flex p-2 py-4 bg-zinc-800 fixed bottom-0 inset-x-0 z-10">
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-12 px-4 mr-4 rounded-full bg-zinc-500"
        />
        <button className="px-3 rounded-full bg-amber-400">
          <HiArrowUp size={24} className="text-zinc-800" />
        </button>
      </form> */}
    </div>
  );
}
