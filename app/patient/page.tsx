"use client";

import { useRef } from "react";
import PersonalInfoSection from "../components/forms/PersonalInfoSection";
import ContactInfoSection from "../components/forms/ContactInfoSection";
import EmergencyContactSection from "../components/forms/EmergencyContactSection";
import { usePatientForm } from "../hooks/usePatientForm";
import { usePatientSync } from "../hooks/usePatientSync";

export default function Page() {
  const patientId = useRef(crypto.randomUUID()).current;

  const patientFormContext = usePatientForm()!;
  const statusSync = usePatientSync({ form: patientFormContext, patientId });

  const onSubmit = async (data: any) => {
    try {
      statusSync.setStatus("submitted");
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
    <div className=" w-full min-h-screen flex flex-col items-center bg-[#F8FAFC] ">
      {/* Top Bar */}
      <div className="w-full bg-[#0a82c7] text-white py-3 px-6 md:px-12 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-sm md:text-base">
          <span>🏥</span>
          <span>Agnos Health</span>
        </div>
        <div className="text-xs text-blue-100 opacity-90">
          Patient Registration System
        </div>
      </div>

      {/* Hero Banner */}
      <div className="w-full bg-[#085f8c] text-white py-6 md:py-8 px-4 flex flex-col items-center text-center shadow-inner">
        <h1 className="text-xl md:text-2xl font-bold">
          Patient Information Form
        </h1>
        <p className="text-xs md:text-sm text-blue-100 mt-1 opacity-80">
          Please fill in your details accurately. Fields marked * are required.
        </p>
      </div>

      <div className="max-w-360 w-full px-4 md:px-6 lg:px-8 mt-5 flex justify-end">
        {statusSync.status === "active" && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#10B981] bg-[#EFFAF5] text-[#047857] text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            Syncing Live
          </div>
        )}
        {statusSync.status === "inactive" && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#CBD5E1] bg-[#F8FAFC] text-[#475569] text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#64748B]"></span>
            Synced
          </div>
        )}
        {statusSync.status === "submitted" && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#3B82F6] bg-[#EFF6FF] text-[#1D4ED8] text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
            Submitted
          </div>
        )}
      </div>

      <div className=" max-w-360 w-full flex flex-col gap-5 px-4 pt-2 pb-8 md:px-6 md:pt-4 lg:px-8 lg:pb-32">
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
                {statusSync.status === "submitted" && (
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
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


