interface MessageProps {
  props: {
    id: string;
    date: string;
    content: string;
    from: string;
  };
}

export default function Message({ props }: MessageProps) {
  const date = new Date(props.date).toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
  });

  function isMyMessage() {
    if (props.from === "neli") {
      return "self-end bg-amber-900";
    }
    return "self-start bg-zinc-700";
  }

  return (
    <div className={`m-4 p-2 self-start rounded-md drop-shadow-md ${isMyMessage()}`}>
      <p className="max-w-sm whitespace-normal break-words">
        {props.content}
      </p>
      <p className="text-xs text-zinc-400 text-right">{date}</p>
    </div>
  );
}
