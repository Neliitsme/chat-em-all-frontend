import Image from "next/image";
import Link from "next/link";
import { ChatPreviewBody } from "../pages";

interface ChatPreviewProps {
  chatPreviewBody: ChatPreviewBody;
}

export default function ChatPreview({ chatPreviewBody }: ChatPreviewProps) {
  return (
    <div className="border-b-2 flex p-2 w-screen h-24">
      <div className="h-full w-20 relative">
        <Image
          src={chatPreviewBody.avatar}
          alt="Avatar"
          fill
          className="rounded-xl"
        />
      </div>
      <div className="mx-2 w-4/5">
        <p className="font-bold text-lg">{chatPreviewBody.username}</p>
        <p className="whitespace-normal break-words line-clamp-2 text-zinc-300">
          {chatPreviewBody.latestMessage}
        </p>
      </div>
    </div>
  );
}
