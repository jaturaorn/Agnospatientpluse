import { DropdownField } from "./DropdownField";

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

const PersonalInfoSection = ({ form }: any) => {
  const { register, control, formState: { errors } = {} } = form || {};

  const firstNameError = !!errors?.firstName;
  const lastNameError = !!errors?.lastName;
  const genderError = !!errors?.gender;
  const nationalityError = !!errors?.nationality;
  const languageError = !!errors?.language;
  const religionError = !!errors?.religion;
  const dateOfBirthError = errors?.dateOfBirth;

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
          <h6 className={`text-sm ${dateOfBirthError ? "text-identity4-rose" : ""}`}>Date of Birth*</h6>
          <input
            {...register("dateOfBirth")}
            type="text"
            placeholder="DD / MM / YYYY"
            className={`input_Default_Style textbox_state ${dateOfBirthError ? "ring ring-identity4-rose" : ""} text-sm`}
          />
          {dateOfBirthError && (
            <p className="text-identity4-rose text-xs mt-1">
              {dateOfBirthError.message as string}
            </p>
          )}
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

