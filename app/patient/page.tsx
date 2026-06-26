"use client";

import PersonalInfoSection from "../components/forms/PersonalInfoSection";
import { usePatientForm } from "../hooks/usePatientForm";
import { usePatientSync } from "../hooks/usePatientSync";

export default function Page() {
  const patientFormContext = usePatientForm()!;
  const statusSync = usePatientSync(patientFormContext, patientId)

  
  return <div className=" w-full min-h-[100vh] flex flex-col items-center ">
    <div className=" max-w-[1440px] w-full flex flex-col gap-5 px-4 pt-4 pb-8 md:px-6 md:pt-6 md:pb-16 lg:pt-8 lg:px-8 lg:pb-32">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#282E43]">
            Patient Form
      </h2>
    <form className="w-full flex flex-col gap-5">
      <div className="w-full flex flex-col gap-2 p-5 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-white rounded-[20px]">
        <PersonalInfoSection form={patientFormContext} />
      </div>
    </form>
    </div>
    </div>
}