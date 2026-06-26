import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Controller } from "react-hook-form";

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

const nationalityOptions = [
  "Thai",
  "American",
  "British",
  "Chinese",
  "Japanese",
  "Singaporean",
  "Other",
];

const languageOptions = [
  "Thai",
  "English",
  "Chinese",
  "Japanese",
  "Other",
];

const religionOptions = [
  "Buddhism",
  "Christianity",
  "Islam",
  "Hinduism",
  "Sikhism",
  "None",
  "Other",
];

interface DropdownFieldProps {
  label: string;
  name: string;
  control: any;
  options: string[];
  placeholder?: string;
  error?: boolean;
}

const DropdownField = ({
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

const PersonalInfoSection = ({ form }: any) => {
  const { register, control, formState: { errors } = {} } = form || {};

  const firstNameError = !!errors?.firstName;
  const lastNameError = !!errors?.lastName;
  const genderError = !!errors?.gender;
  const nationalityError = !!errors?.nationality;
  const languageError = !!errors?.language;
  const religionError = !!errors?.religion;

  return (
    <>
      <div className=" borber border-l-2 border-[#0a82c7] pl-4">
        <h4 className="text-lg md:text-xl font-bold text-[#282E43]">
          Personal Information
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="w-full">
          <h6
            className={`text-sm ${firstNameError ? "text-identity4-rose" : ""}`}
          >
            First Name*
          </h6>
          <input
            {...register("firstName")}
            type="text"
            placeholder="Your first name"
            className={`input_Default_Style textbox_state
              ${firstNameError ? "ring ring-identity4-rose" : ""} text-sm`}
          />
        </div>

        <div className="w-full">
          <h6
            className={`text-sm ${lastNameError ? "text-identity4-rose" : ""}`}
          >
            Last Name*
          </h6>
          <input
            {...register("lastName")}
            type="text"
            placeholder="Your last name"
            className={`input_Default_Style textbox_state ${lastNameError ? "ring ring-identity4-rose" : ""}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex-1">
          <h6 className={`text-sm `}>Middle Name (Optional)</h6>
          <input
            {...register("middleName")}
            type="text"
            placeholder="Your middle name"
            className={`input_Default_Style textbox_state `}
          />
        </div>

        <div className="flex-1">
          <h6 className={`text-sm `}>Date of Birth*</h6>
          <input
            {...register("dateOfBirth")}
            type="text"
            placeholder="DD / MM / YYYY"
            className={`input_Default_Style textbox_state `}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DropdownField
          label="Gender*"
          name="gender"
          control={control}
          options={genderOptions}
          placeholder="Select gender"
          error={genderError}
        />
        <DropdownField
          label="Nationality*"
          name="nationality"
          control={control}
          options={nationalityOptions}
          placeholder="Select nationality"
          error={nationalityError}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DropdownField
          label="Preferred Language*"
          name="language"
          control={control}
          options={languageOptions}
          placeholder="Select language"
          error={languageError}
        />
        <DropdownField
          label="Religion (Optional)"
          name="religion"
          control={control}
          options={religionOptions}
          placeholder="Select religion"
          error={religionError}
        />
      </div>
    </>
  );
};

export default PersonalInfoSection;

