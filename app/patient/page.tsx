"use client";

import PersonalInfoSection from "../components/forms/PersonalInfoSection";
import ContactInfoSection from "../components/forms/ContactInfoSection";
import EmergencyContactSection from "../components/forms/EmergencyContactSection";
import { usePatientForm } from "../hooks/usePatientForm";
import { usePatientSync } from "../hooks/usePatientSync";

export default function Page() {
  const patientId = crypto.randomUUID();

  const patientFormContext = usePatientForm()!;
  const statusSync = usePatientSync({ form: patientFormContext, patientId });

  const onSubmit = async (data: any) => {
    try {
      await fetch("/api/sync-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          status: "submitted",
          formData: data,
        }),
      });
      alert("Registration Submitted Successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <div className=" w-full min-h-screen flex flex-col items-center ">
      <div className=" max-w-360 w-full flex flex-col gap-5 px-4 pt-4 pb-8 md:px-6 md:pt-6 md:pb-16 lg:pt-8 lg:px-8 lg:pb-32">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#282E43]">
          Patient Form
        </h2>
        <form onSubmit={patientFormContext.handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
          <div className="w-full flex flex-col gap-2 p-5 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-white rounded-[20px]">
            <PersonalInfoSection form={patientFormContext} />
            <ContactInfoSection form={patientFormContext} />
            <EmergencyContactSection form={patientFormContext} />
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#E1E7F1]">
              <button
                type="button"
                className="px-6 py-2.5 rounded-xl border border-[#E1E7F1] bg-[#F8FAFC] text-[#64686C] text-sm font-semibold hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                onClick={() => patientFormContext.reset()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0a82c7] hover:bg-[#086da8] text-white text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                Submit Registration
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


