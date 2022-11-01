import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";
import ChatPreview from "../components/ChatPreview";
import SearchBar from "../components/SearchBar";

export default function Home() {
  function handleOpenChat() {}

  const openChats = [
    {
      id: "1",
      avatar: "/avatar.jpg",
      username: "vaditel",
      latestMessage:
        "I ain't never seen no mustard on that, but it might be good though, my dad would know better, boutta get him. Aww, mustard! Come on man, now don't put no mustard on that, you need to put a little season on that thing! WHAT! Man come on get that pepper off there! Come on, somebody come get this man! Come on now, come on get that pepper of there, that's just too much doggone pepper. I don't wanna see this no more!",
    },
    {
      id: "2",
      avatar: "/avatar.jpg",
      username: "neli",
      latestMessage: "Ayo",
    },
    {
      id: "3",
      avatar: "/avatar.jpg",
      username: "muza",
      latestMessage: "Wank wank wank",
    },
  ];

  const listPreviews = openChats.map((preview) => (
    <ChatPreview
      key={preview.id}
      id={preview.id}
      avatar={preview.avatar}
      username={preview.username}
      latestMessage={preview.latestMessage}
    />
  ));

  return (
    <div>
      <SearchBar isSearching={false} />
      <ul className="h-screen flex-col">{listPreviews}</ul>
    </div>
  );
}
