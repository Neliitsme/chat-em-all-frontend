import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { HiArrowUp } from "react-icons/hi";
import Image from "next/image";
import SearchBar from "../components/SearchBar";
import { FoundUser } from ".";
import { Dispatch, SetStateAction } from "react";

interface SearchProps {
  foundUser: FoundUser[];
  setFoundUser: Dispatch<SetStateAction<FoundUser[]>>;
}

// Add checks for existing chats
export default function Search({ foundUser, setFoundUser }: SearchProps) {
  return (
    <>
      {foundUser.length > 0 ? (
        <>
          <Link
            href={{
              pathname: "/chats/[id]",
              query: { id: foundUser[0].id },
            }}
            className=""
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
          </Link>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
