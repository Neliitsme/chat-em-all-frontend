import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { HiArrowUp } from "react-icons/hi";
import Image from "next/image";
import SearchBar from "../../components/SearchBar";

export default function UserSearch({ props }: SearchProps) {
  return (
    <div>
      <Link
        href={{
          pathname: "/chats/[id]",
          query: { id: props.id },
        }}
        className=""
      >
        <div className="border-b-2 flex p-2 w-screen h-24">
          <div className="h-full w-20 relative">
            <Image
              src={props.avatar}
              alt="Avatar"
              fill
              className="rounded-xl"
            />
          </div>
          <div className="mx-2 w-4/5">
            <p className="font-bold text-lg">{props.username}</p>
            <p className="whitespace-normal line-clamp-2 text-zinc-300/40">
              Tap to start a chat
            </p>
          </div>
        </div>
      </Link>
      <SearchBar isSearching={true} />
    </div>
  );
}

interface SearchProps {
  props: {
    id: string;
    username: string;
    avatar: string;
  };
}

export async function getStaticPaths() {
  return {
    paths: ["vaditel", "neli"].map((username) => ({
      params: { username: username.toString() },
    })),
    fallback: false,
  };
  // Return a list of possible value for id
}

export async function getStaticProps() {
  const props = {
    id: "1",
    username: "vaditel",
    avatar: "/avatar.jpg",
  };
  // Fetch necessary data for the blog post using params.id
  return {
    props: {
      props,
    },
  };
}
