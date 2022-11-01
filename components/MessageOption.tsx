interface MessageOptionProps {
  emotion: string;
  message: string;
  blurred?: boolean;
}

export default function MessageOption({
  emotion,
  message,
  blurred,
}: MessageOptionProps) {
  return (
    <div className="flex-column">
      <div className="border-2 border-amber-400 rounded-xl p-2 max-w-[15rem] max-h-36 w-max h-max truncate bg-zinc-800 drop-shadow-md">
        <p
          className={`text-center whitespace-normal break-words ${
            blurred && "blur-md"
          }`}
        >
          {message}
        </p>
      </div>
      <p className="text-center text-2xl">{emotion}</p>
    </div>
  );
}
