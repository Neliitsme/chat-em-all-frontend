import ChatPreview from "../components/ChatPreview";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Search from "./search";
import Chat from "./chat";
import removeCookies from "../utils/removeCookies";

interface ChatPreviewResponseBody {
  id: string;
  name: string;
  users_ids: string[];
  messages: [{ text: string; owner_id: string }];
}

export interface ChatPreviewBody {
  id: string;
  avatar: string;
  username: string;
  user_id: string;
  latestMessage: string;
}

export interface FoundUser {
  id: string;
  username: string;
  email: string;
}

export interface Me {
  id: string;
  username: string;
  email: string;
}

export default function Home() {
  const router = useRouter();
  const [chatPreviews, setChatPreviews] = useState<ChatPreviewBody[]>([]);
  const [activePage, setActivePage] = useState("main"); // main, search, chat, settings
  const [foundUser, setFoundUser] = useState<FoundUser[]>([]);
  const [activeChat, setActiveChat] = useState<ChatPreviewBody | null>(null);
  const [me, setMe] = useState<Me>({ id: "", username: "", email: "" });

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
      {(activePage === "main" || activePage === "search") && (
        <SearchBar
          activePage={activePage}
          setActivePage={setActivePage}
          foundUser={foundUser}
          setFoundUser={setFoundUser}
        />
      )}
      {activePage === "main" && (
        <ul className="h-screen flex-col">{displayChats()}</ul>
      )}
      {activePage === "search" && (
        <Search foundUser={foundUser} setFoundUser={setFoundUser} />
      )}
      {activePage === "chat" && (
        <Chat
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          activePage={activePage}
          setActivePage={setActivePage}
          me={me}
        />
      )}
    </>
  );
}
