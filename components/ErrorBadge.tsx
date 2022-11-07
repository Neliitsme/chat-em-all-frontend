interface ErrorBadgeProps {
  text: string;
}

export default function ErrorBadge({ text }: ErrorBadgeProps) {
  return (
    <div className="border-2 border-red-500 text-red-500 rounded-lg w-64">
      <p className="m-2 whitespace-normal break-words text-center">
        Error: {text}
      </p>
    </div>
  );
}
