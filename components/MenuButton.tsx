import { AnimatePresence } from "framer-motion";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { HiMenu } from "react-icons/hi";
import NavMenu from "./NavMenu";

export default function MenuButtons() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="pt-3 px-4">
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <HiMenu size={24} />
      </button>
      {isOpen && <NavMenu />}
    </div>
  );
}
