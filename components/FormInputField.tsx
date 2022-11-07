interface FormInputFieldProps {
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInputField({
  label,
  placeholder,
  type,
  value,
  onChange,
}: FormInputFieldProps) {
  return (
    <label className="">
      <span className="block">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="block border mt-1 text-black px-2 py-1 w-64 rounded-md focus:outline-none focus:border-amber-500"
      />
    </label>
  );
}
