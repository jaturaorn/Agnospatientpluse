import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Controller } from "react-hook-form";

const PersonalInfoSection = ({ form }: any) => {
  const { register, watch, control, formState: { errors } = {} } = form || {};

  const selectedValue = watch("country");
  const firstNameError = !!errors.firstName;
  const lastNameError = !!errors.lastName;
  const emailNameError = !!errors.email;
  const countryError = !!errors.country;
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
            Last Name
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
          <h6 className={`text-sm `}>Date of Birth</h6>
          <input
            {...register("dateOfBirth")}
            type="text"
            placeholder="DD / MM / YYYY"
            className={`input_Default_Style textbox_state `}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h6>Gender</h6>
        </div>
        <div>
          <h6>Nationality</h6>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h6>Preferred Language</h6>
        </div>
        <div>
          <h6>Religion (Optional)</h6>
        </div>
      </div>
    </>
  );
};

export default PersonalInfoSection;
