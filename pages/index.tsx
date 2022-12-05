import ChatPreview from "../components/ChatPreview";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Search from "../components/Search";
import Chat from "../components/Chat";
import removeCookies from "../utils/removeCookies";
import { Me } from "../interfaces/Me";
import { FoundUser } from "../interfaces/FoundUser";
import { ChatPreviewBody } from "../interfaces/ChatPreviewBody";
import { ChatPreviewResponseBody } from "../interfaces/ChatPreviewResponseBody";
import { ChatMessageResponseBody } from "../interfaces/ChatMessageResponseBody";

export default function Home() {
  const router = useRouter();
  const [chatPreviews, setChatPreviews] = useState<ChatPreviewBody[]>([]);
  const [activePage, setActivePage] = useState("main"); // main, search, chat
  const [foundUser, setFoundUser] = useState<FoundUser[]>([]);
  const [activeChat, setActiveChat] = useState<ChatPreviewBody | null>(null);
  const [me, setMe] = useState<Me>({ id: "", username: "", email: "" });
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const cookies = new Cookies();
    axios
      .get(`${process.env.NEXT_PUBLIC_API_HOST}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${cookies.get("access_token")}`,
        },
      })
      .then((res) => {
        setMe(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          removeCookies();
          router.push("/signin");
        }
        console.log(err);
      });

    axios
      .get(`${process.env.NEXT_PUBLIC_API_HOST}/api/chats/get_chats`, {
        headers: {
          Authorization: `Bearer ${cookies.get("access_token")}`,
        },
      })
      .then((res) => {
        const openChats: ChatPreviewBody[] = [];

        res.data.forEach((chat: ChatPreviewResponseBody) => {
          openChats.push({
            id: chat.id,
            avatar: "/avatar.jpg",
            username: chat.name,
            user_id: chat.users_ids[0],
            latestMessage: chat.messages[chat.messages.length - 1].text,
          });
        });

        setChatPreviews([...openChats]);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          removeCookies();
          router.push("/signin");
        }
        console.log(err);
      });
  }, [router]);

  const handlePlayNotificationSound = useCallback(() => {
    const audio = new Audio("/message-notification.m4a");
    audio.volume = 0.4;
    audio.play();
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
      const chatPreviewsClone = [...chatPreviews];
      chatPreviewsClone[
        chatPreviewsClone.findIndex((chat) => chat.id === data.chat_id)
      ].latestMessage = data.text;
      setChatPreviews(() => [...chatPreviewsClone]);
      handlePlayNotificationSound();
    };

    setWs(socket);

    return () => {
      socket.close();
      console.log("disconnected");
    };
  }, [activeChat?.id, chatPreviews, handlePlayNotificationSound, me.id]);

  function handleOpenChat(chatPreview: ChatPreviewBody) {
    setActiveChat(chatPreview);
    setActivePage("chat");
  }

  function displayChats() {
    return chatPreviews.map((chatPreview) => {
      return (
        <a
          key={chatPreview.id}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleOpenChat(chatPreview);
          }}
        >
          <ChatPreview chatPreviewBody={chatPreview} />
        </a>
      );
    });
  }

  return (
    <>
      {activePage === "main" && (
        <ul id="main" className="h-screen flex-col">
          {displayChats()}
        </ul>
      )}
      {activePage === "search" && (
        <Search
          foundUser={foundUser}
          setFoundUser={setFoundUser}
          activePage={activePage}
          setActivePage={setActivePage}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        />
      )}
      {(activePage === "main" || activePage === "search") && (
        <SearchBar
          activePage={activePage}
          setActivePage={setActivePage}
          foundUser={foundUser}
          setFoundUser={setFoundUser}
        />
      )}
      {activePage === "chat" && (
        <Chat
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          activePage={activePage}
          setActivePage={setActivePage}
          handlePlayNotificationSound={handlePlayNotificationSound}
          me={me}
        />
      )}
    </>
  );
}
