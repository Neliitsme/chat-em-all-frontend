export default function PillButton({ text }) {
  return (
    <button className="rounded-full bg-amber-500 hover:bg-amber-600 text-black py-2 px-10">
      {text}
    </button>
  );
}
