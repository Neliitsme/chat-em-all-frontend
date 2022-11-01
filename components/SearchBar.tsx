import Link from "next/link";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";
import { HiMenu } from "react-icons/hi";
import { useState } from "react";
import { useRouter } from "next/router";
import ReturnButton from "./ReturnButton";
import MenuButton from "./MenuButton";

interface SearchBarProps {
  isSearching: boolean;
}

export default function SearchBar({ isSearching }: SearchBarProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  function handleSearch() {
    search.trim() ? router.push(`/search/${search}`) : null;
  }

  return (
    <div className="flex mb-4 mx-4 py-3 bg-zinc-800 rounded-2xl fixed bottom-0 inset-x-0 z-10 border-amber-400 border-2">
      {isSearching ? <ReturnButton /> : <MenuButton />}
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
          href={`/search/${search}`}
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
