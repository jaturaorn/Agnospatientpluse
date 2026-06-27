import { UseFormReturn } from "react-hook-form";
import { PatientFormValues } from "./usePatientForm";
import { useEffect, useRef, useState } from "react";
import useDebounce from "../util/useDebounce";

interface UsePatientSyncProps {
  form: UseFormReturn<PatientFormValues>;
  patientId: string;
}

export const usePatientSync = ({ form, patientId }: UsePatientSyncProps) => {
  const [status, setStatus] = useState<"active" | "inactive" | "submitted">(
    "inactive",
  );

  // 1. Monitor all formdata in realtime
  const currentFormData = form.watch();
  const serializedFormData = JSON.stringify(currentFormData);

  // 2. ทำ Debounce ข้อมูลฟอร์ม โดยแปลงเป็น string เพื่อให้เทียบความแตกต่างได้ถูกต้อง (ลดภาระ Network ส่งข้อมูลทุกๆ 400ms หลังหยุดพิมพ์)
  const debouncedSerializedFormData = useDebounce(serializedFormData, 400);

  const inacvtiveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRenderActive = useRef(true);
  const isFirstRenderDebounce = useRef(true);
  const isActiveRef = useRef(false);

  // Function to send data to the API to trigger a Pusher Channel
  const triggerSyncAPI = async (
    currentStatus: typeof status,
    dataPayLoad: PatientFormValues,
  ) => {
    try {
      await fetch("/api/sync-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          status: currentStatus,
          formData: dataPayLoad,
        }),
      });
    } catch (error) {
      console.error("Failed to sync data to staff view:", error);
    }
  };

  // 3. จับจังหวะการพิมพ์เพื่อเปลี่ยนสถานะเป็น "active" ทันที (ไม่ต้องรอ Debounce)
  useEffect(() => {
    if (isFirstRenderActive.current) {
      isFirstRenderActive.current = false;
      return;
    }

    if (status === "submitted") return;

    if (!isActiveRef.current) {
      isActiveRef.current = true;
      setStatus("active");
      triggerSyncAPI("active", form.getValues());
    }

    if (inacvtiveTimerRef.current) clearTimeout(inacvtiveTimerRef.current);

    // 4. ถ้าหยุดพิมพ์ครบ 3 วินาที (3000ms) ให้ปรับสถานะเป็น "inactive"
    inacvtiveTimerRef.current = setTimeout(() => {
      isActiveRef.current = false;
      setStatus("inactive");
      triggerSyncAPI("inactive", form.getValues());
    }, 3000);

    return () => {
      if (inacvtiveTimerRef.current) {
        clearTimeout(inacvtiveTimerRef.current);
      }
    };
  }, [serializedFormData]);

  // 5. ส่งข้อมูลชุดใหญ่ (FormData) ไปอัปเดตเมื่อ Debounce ทำงานเสร็จสิ้น
  useEffect(() => {
    if (isFirstRenderDebounce.current) {
      isFirstRenderDebounce.current = false;
      return;
    }

    if (status === "submitted") return;

    // ยิงข้อมูลชุดใหญ่ขึ้นระบบเฉพาะตอนที่ผ่าน Debounce 400ms มาแล้วเท่านั้น
    const parsedData = JSON.parse(debouncedSerializedFormData);
    triggerSyncAPI(status, parsedData);
  }, [debouncedSerializedFormData]);

  return { status, setStatus };
};
