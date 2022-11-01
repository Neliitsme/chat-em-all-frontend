import { useRouter } from "next/router";
import { HiArrowLeft } from "react-icons/hi";

export default function ReturnButton() {
  const router = useRouter();
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        router.back();
      }}
      className="px-4"
    >
      <HiArrowLeft
        size={24}
        className=""
      />
    </button>
  );
}
