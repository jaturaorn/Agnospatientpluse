import { DropdownField } from "./DropdownField";

interface EmergencyContactSectionProps {
  form: any;
}

const relationshipOptions = [
  "Parent",
  "Spouse",
  "Sibling",
  "Child",
  "Friend",
  "Other",
];

const EmergencyContactSection = ({ form }: EmergencyContactSectionProps) => {
  const { register, control } = form || {};

  return (
    <>
      <div className="border-l-2 border-[#0a82c7] pl-4">
        <h4 className="text-lg md:text-xl font-bold text-[#282E43]">
          Emergency Contact
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="w-full">
          <h6 className="text-sm text-[#282E43]">Contact Name (optional)</h6>
          <input
            {...register("emergencyContact")}
            type="text"
            placeholder="Full name"
            className="input_Default_Style textbox_state text-sm mt-1"
          />
        </div>

        <DropdownField
          label="Relationship (optional)"
          name="emergencyRelationship"
          control={control}
          options={relationshipOptions}
          placeholder="Select relationship"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="w-full">
          <h6 className="text-sm text-[#282E43]">Contact Phone (optional)</h6>
          <input
            {...register("emergencyPhone")}
            type="text"
            placeholder="+66 XX XXX XXXX"
            className="input_Default_Style textbox_state text-sm mt-1"
          />
        </div>
        <div></div>
      </div>
    </>
  );
};

export default EmergencyContactSection;
