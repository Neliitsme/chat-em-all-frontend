import Link from "next/link";
import Image from "next/image";
import SearchIcon from "./SearchIcon";
import { IoSearch } from "react-icons/io5";

export default function SearchBar() {
  function handleSearch() {}

  return (
    <form className="flex mb-2 mx-4 p-3 bg-zinc-800 rounded-full fixed bottom-0 inset-x-0 z-10 border-amber-400 border-4">
      <input
        type="text"
        placeholder="Search"
        className="w-full h-12 px-4 rounded-full bg-zinc-500"
      />
      <button onClick={handleSearch} className="px-4">
        <IoSearch size={24} />
      </button>
    </form>
  );
}
