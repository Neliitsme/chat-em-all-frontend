interface PillButtonProps {
  text: string;
}

export default function PillButton({ text }: PillButtonProps) {
  return (
    <button
      className="rounded-full drop-shadow-md bg-amber-500 hover:bg-amber-600 text-black py-2 px-10"
      onClick={(e) => e.preventDefault()}
    >
      {text}
    </button>
  );
}
