interface PillButtonProps {
  text: string;
  clickFn: () => void;
}

export default function PillButton({ text, clickFn }: PillButtonProps) {
  return (
    <button
      className="rounded-full bg-amber-500 hover:bg-amber-600 text-black py-2 px-10"
      onClick={clickFn}
    >
      {text}
    </button>
  );
}
