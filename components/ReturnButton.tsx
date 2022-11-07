import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { HiArrowLeft } from "react-icons/hi";

interface ReturnButtonProps {
  goBack: Dispatch<SetStateAction<boolean>>;
}

export default function ReturnButton({ goBack }: ReturnButtonProps) {
  const router = useRouter();
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        goBack(true)
      }}
      className="px-4"
    >
      <HiArrowLeft size={24} className="" />
    </button>
  );
}
