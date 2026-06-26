import { Controller } from "react-hook-form";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

interface DropdownFieldProps {
  label: string;
  name: string;
  control: any;
  options: string[];
  placeholder?: string;
  error?: boolean;
}

export const DropdownField = ({
  label,
  name,
  control,
  options,
  placeholder = "Select...",
  error = false,
}: DropdownFieldProps) => {
  return (
    <div className="w-full relative">
      <h6 className={`text-sm ${error ? "text-identity4-rose" : ""}`}>
        {label}
      </h6>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative w-full mt-1">
            <Listbox value={field.value} onChange={field.onChange}>
              <ListboxButton
                className={`group input_Default_Style textbox_state flex justify-between items-center text-left cursor-pointer ${
                  error ? "ring ring-identity4-rose" : ""
                } ${!field.value ? "text-[#64686C]" : "text-[#282E43]"}`}
              >
                <span>{field.value || placeholder}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 text-[#64686C] transition-transform duration-200 group-data-[open]:rotate-180"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </ListboxButton>
              <ListboxOptions
                transition
                className="absolute left-0 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-[#E1E7F1] bg-white py-1 shadow-lg focus:outline-none z-50 transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
              >
                {options.map((option) => (
                  <ListboxOption
                    key={option}
                    value={option}
                    className="cursor-pointer select-none relative py-2.5 px-5 text-sm text-[#282E43] data-[focus]:bg-[#F8FAFC] data-[selected]:font-semibold data-[selected]:text-[#0a82c7] transition-colors"
                  >
                    {option}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
          </div>
        )}
      />
    </div>
  );
};
