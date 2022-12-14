import { Me } from "../interfaces/Me";

interface MessageProps {
  props: {
    id: string;
    text: string;
    owner_id: string;
    created: string;
  };
  me: Me;
}

export default function Message({ props, me }: MessageProps) {
  const date = new Date(props.created).toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
  });

  function isMyMessage() {
    if (props.owner_id === me.id) {
      return "self-end bg-amber-900";
    }
    return "self-start bg-zinc-700";
  }

  return (
    <div
      className={`m-4 p-2 self-start rounded-md drop-shadow-md ${isMyMessage()}`}
    >
      <p className="max-w-sm whitespace-normal break-words">{props.text}</p>
      <p className="text-xs text-zinc-400 text-right">{date}</p>
    </div>
  );
}
