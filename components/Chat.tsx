import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import MessageOption from "./MessageOption";
import Message from "./Message";
import { ChatPreviewBody, Me } from "../pages";
import axios from "axios";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import removeCookies from "../utils/removeCookies";

export interface ChatMessagesResponseBody {
  id: string;
  text: string;
  owner_id: string;
  created: string;
}

interface ChatProps {
  activeChat: ChatPreviewBody | null;
  setActiveChat: Dispatch<SetStateAction<ChatPreviewBody | null>>;
  activePage: string;
  setActivePage: Dispatch<SetStateAction<string>>;
  me: Me;
}

interface MessageOptionsResponseBody {
  face: string;
  text: string;
}

export default function Chat({
  activeChat,
  setActiveChat,
  activePage,
  setActivePage,
  me,
}: ChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessagesResponseBody[]>([]);
  const [messageOptions, setMessageOptions] = useState<
    MessageOptionsResponseBody[]
  >([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const bottomRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const cookies = new Cookies();

    axios
      .get(`${process.env.NEXT_PUBLIC_API_HOST}/api/chats/get_history`, {
        params: {
          chat_id: activeChat?.id,
        },
        headers: {
          Authorization: `Bearer ${cookies.get("access_token")}`,
        },
      })
      .then((res) => {
        setMessages(res.data);
        bottomRef.current?.scrollIntoView();
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          removeCookies();
          router.push("/signin");
        }
        console.log(err);
      });

    axios
      .get(`${process.env.NEXT_PUBLIC_API_HOST}/api/chats/get_options`, {
        params: { chat_id: activeChat?.id },
        headers: {
          Authorization: `Bearer ${cookies.get("access_token")}`,
        },
      })
      .then((res) => {
        setMessageOptions(res.data);
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          removeCookies();
          router.push("/signin");
        }
        console.log(err);
      });
  }, [activeChat?.id, router]);

  const handleUpdateMessageOptions = useCallback(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_HOST}/api/chats/get_options`, {
        params: { chat_id: activeChat?.id },
        headers: {
          Authorization: `Bearer ${new Cookies().get("access_token")}`,
        },
      })
      .then((res) => {
        setMessageOptions(res.data);
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          removeCookies();
          router.push("/signin");
        }
        console.log(err);
      });
  }, [activeChat?.id, router]);

  useEffect(() => {
    const socket = new WebSocket(
      `wss://${process.env.NEXT_PUBLIC_API_HOSTNAME}/api/ws/${new Cookies().get(
        "access_token"
      )}`
    );
    socket.onopen = () => {
      console.log("Connected to websocket");
    };

    socket.onmessage = (e) => {
      setMessages((m) => [...m, JSON.parse(JSON.parse(e.data))]);
      const audio = new Audio("/message-notification.m4a");
      audio.volume = 0.4;
      audio.play();
      bottomRef.current?.scrollIntoView();
      handleUpdateMessageOptions();
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [handleUpdateMessageOptions]);

  function handleCloseChat() {
    setActivePage("main");
    setActiveChat(null);
  }

  function displayMessages() {
    return messages.map((message) => {
      return <Message key={message.id} props={message} me={me} />;
    });
  }

  function handleSendMessage(message: MessageOptionsResponseBody) {
    if (ws !== null && ws.OPEN) {
      ws.send(JSON.stringify({ chat_id: activeChat?.id, face: message.face }));
      ws.onmessage = (e) => {
        setMessages((m) => [...m, JSON.parse(JSON.parse(e.data))]);
        bottomRef.current?.scrollIntoView();
        handleUpdateMessageOptions();
      };
    }
  }

  function displayMessageOptions() {
    return messageOptions.map((option) => {
      return (
        <a
          key={option.face}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            option.face !== "💸" && handleSendMessage(option);
          }}
        >
          <MessageOption
            face={option.face}
            text={option.text}
            blurred={option.face === "💸"}
          />
        </a>
      );
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
        {displayMessageOptions()}
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
