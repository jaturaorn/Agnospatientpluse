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
      <h4 className="text-lg md:text-xl font-bold text-[#282E43]">
        Personal Information
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex-1">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex-1">
          <h6
            className={`text-sm ${emailNameError ? "text-identity4-rose" : ""}`}
          >
            Email Address
          </h6>
          <input
            {...register("email")}
            type="text"
            placeholder="Your email"
            className={`input_Default_Style textbox_state
              ${emailNameError ? "ring ring-identity4-rose" : ""} text-sm`}
          />
        </div>
        <div>
          <h6>Date of Birth</h6>
        </div>
        <div>
          <h6>Gender</h6>
        </div>
      </div>

      <div>
        <h6>Address</h6>
        <div>
          <h6>Emergency Contact</h6>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <h6>Language</h6>
        </div>
        <div>
          <h6>Nationality</h6>
        </div>
        <div>
          <h6>Religion</h6>
        </div>
      </div>
    </>
  );
};

export default PersonalInfoSection;
