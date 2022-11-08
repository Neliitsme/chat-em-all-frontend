import Link from "next/link";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";
import { HiMenu } from "react-icons/hi";
import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/router";
import ReturnButton from "./ReturnButton";
import MenuButton from "./MenuButton";
import axios from "axios";
import Cookies from "universal-cookie";
import { FoundUser } from "../pages";
import removeCookies from "../utils/removeCookies";

interface SearchBarProps {
  activePage: string;
  setActivePage: Dispatch<SetStateAction<string>>;
  foundUser: FoundUser[];
  setFoundUser: Dispatch<SetStateAction<FoundUser[]>>;
}

// TODO: Open chats from search page
export default function SearchBar({
  activePage,
  setActivePage,
  foundUser,
  setFoundUser,
}: SearchBarProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  function handleSearch() {
    if (activePage !== "search" && search.trim() !== "") {
      setActivePage("search");
      setIsSearching(true);
    }
    if (search.trim() === "") {
      return;
    }

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/users/search`,
        {},
        {
          headers: {
            Authorization: `Bearer ${new Cookies().get("access_token")}`,
          },
          params: {
            search_query: search,
          },
        }
      )
      .then((res) => {
        setFoundUser(res.data);
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
    <div className="flex mb-4 mx-4 py-3 bg-zinc-800 rounded-2xl fixed bottom-0 inset-x-0 z-10 border-amber-400 border-2 drop-shadow-md">
      {isSearching ? (
        <ReturnButton
          goBack={() => {
            setActivePage("main");
            setSearch("");
            setIsSearching(false);
          }}
        />
      ) : (
        <MenuButton />
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex w-full"
      >
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 px-4 rounded-full bg-zinc-500"
        />
        <a
          href={"#"}
          onClick={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="px-4 py-3"
        >
          <IoSearch size={24} />
        </a>
      </form>
    </div>
  );
}
