import { UseFormReturn } from "react-hook-form";

interface ContactInfoSectionProps {
  form: any;
}

const ContactInfoSection = ({ form }: ContactInfoSectionProps) => {
  const { register, formState: { errors } = {} } = form || {};

  const phoneError = !!errors?.phone;
  const emailError = !!errors?.email;
  const addressError = !!errors?.address;

  return (
    <>
      <div className="border-l-2 border-[#0a82c7] pl-4">
        <h4 className="text-lg md:text-xl font-bold text-[#282E43]">
          Contact Information
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="w-full">
          <h6 className={`text-sm ${phoneError ? "text-identity4-rose" : ""}`}>
            Phone Number *
          </h6>
          <input
            {...register("phone")}
            type="text"
            placeholder="+66 XX XXX XXXX"
            className={`input_Default_Style textbox_state ${
              phoneError ? "ring ring-identity4-rose" : ""
            } text-sm`}
          />
          <span className="text-xs text-[#64686C] mt-1 block">
            Include country code
          </span>
        </div>

        <div className="w-full">
          <h6 className={`text-sm ${emailError ? "text-identity4-rose" : ""}`}>
            Email Address *
          </h6>
          <input
            {...register("email")}
            type="text"
            placeholder="example@email.com"
            className={`input_Default_Style textbox_state ${
              emailError ? "ring ring-identity4-rose" : ""
            } text-sm`}
          />
        </div>
      </div>

      <div className="w-full">
        <h6 className={`text-sm ${addressError ? "text-identity4-rose" : ""}`}>
          Address *
        </h6>
        <input
          {...register("address.0")}
          type="text"
          placeholder="Street, City, Province, Postal Code"
          className={`input_Default_Style textbox_state ${
            addressError ? "ring ring-identity4-rose" : ""
          } text-sm`}
        />
      </div>
    </>
  );
};

export default ContactInfoSection;
