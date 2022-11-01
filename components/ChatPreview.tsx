import Image from "next/image";
import Link from "next/link";

interface ChatPreviewProps {
  id: string;
  avatar: string;
  username: string;
  latestMessage: string;
}

export default function ChatPreview({
  id,
  avatar,
  username,
  latestMessage,
}: ChatPreviewProps) {
  return (
    <Link
      href={{
        pathname: "/chats/[id]",
        query: { id },
      }}
      className=""
    >
      <div className="border-b-2 flex p-2 w-screen h-24">
        <div className="h-full w-20 relative">
          <Image src={avatar} alt="Avatar" fill className="rounded-xl" />
        </div>
        <div className="mx-2 w-4/5">
          <p className="font-bold text-lg">{username}</p>
          <p className="whitespace-normal break-words line-clamp-2 text-zinc-300">
            {latestMessage}
          </p>
        </div>
      </div>
    </Link>
  );
}
