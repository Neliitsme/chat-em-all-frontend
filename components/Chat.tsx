import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
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
import axios from "axios";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import removeCookies from "../utils/removeCookies";
import { ChatMessageResponseBody } from "../interfaces/ChatMessageResponseBody";
import { MessageOptionsResponseBody } from "../interfaces/MessageOptionsResponseBody";
import { ChatPreviewBody } from "../interfaces/ChatPreviewBody";
import { Me } from "../interfaces/Me";
import { AnimatePresence, motion } from "framer-motion";

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
  const [messages, setMessages] = useState<ChatMessageResponseBody[]>([]);
  const [messageOptions, setMessageOptions] = useState<
    MessageOptionsResponseBody[]
  >([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messageListBottomRef = useRef<null | HTMLDivElement>(null);
  const messageListRef = useRef<null | HTMLUListElement>(null);

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
        messageListBottomRef.current?.scrollIntoView();
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

  const handlePlayNotification = useCallback(() => {
    const audio = new Audio("/message-notification.m4a");
    audio.volume = 0.4;
    audio.play();
  }, []);

  const handleScrollToBottom = useCallback(() => {
    messageListBottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

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
      const data: ChatMessageResponseBody = JSON.parse(JSON.parse(e.data));
      if (data.chat_id !== activeChat?.id) {
        return;
      }
      if (data.owner_id !== me.id) {
        handlePlayNotification();
      }
      setMessages((m) => [...m, data]);
      handleUpdateMessageOptions();
      handleScrollToBottom();
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [
    activeChat?.id,
    handlePlayNotification,
    handleScrollToBottom,
    handleUpdateMessageOptions,
    me.id,
  ]);

  useEffect(() => {
    messageListRef.current?.addEventListener("scroll", () => {
      const scrollHeight = messageListRef.current?.scrollHeight;
      const scrollTop = messageListRef.current?.scrollTop;
      const clientHeight = messageListRef.current?.clientHeight;
      if (!scrollHeight || !scrollTop || !clientHeight) {
        return;
      }

      if (scrollHeight - scrollTop > clientHeight * 2) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    });
  });

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
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{
        stiffness: "100%",
      }}
    >
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
        <ul
          className="h-full w-screen flex flex-col last:pb-48 overflow-auto"
          ref={messageListRef}
        >
          {displayMessages()}
          <div ref={messageListBottomRef} />
        </ul>
      </div>
      <div className="flex flex-col fixed bottom-0 inset-x-0 z-10">
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              key={"scroll-button"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              onClick={(e) => {
                e.preventDefault();
                handleScrollToBottom();
              }}
              className="flex bg-zinc-800 text-white rounded-full p-2 m-2 drop-shadow-md w-fit justify-center border-2 border-amber-400 place-self-end"
            >
              <IoIosArrowDown size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="flex max-h-48 gap-4 px-2 py-2 items-end overflow-x-scroll">
          {displayMessageOptions()}
        </div>
      </div>
    </motion.div>
  );
}
