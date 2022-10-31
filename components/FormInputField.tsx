interface FormInputFieldProps {
  label: string;
  placeholder: string;
  type: string;
}

export default function FormInputField({
  label,
  placeholder,
  type,
}: FormInputFieldProps) {
  return (
    <label className="">
      <span className="block">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="block border mt-1 text-black px-2 py-1 w-64 rounded-md focus:outline-none focus:border-amber-500"
      />
    </label>
  );
}
