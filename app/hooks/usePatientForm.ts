"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const THAI_PHONE_REGEX = /^(\+66|0)\s?[2-9](?:\s?\d){7,8}$/;

export const patientFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required").superRefine((val, ctx) => {
    const parts = val.replace(/\s/g, "").split("/");
    if (parts.length !== 3) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "รูปแบบวันที่ไม่ถูกต้อง (DD / MM / YYYY)" });
      return;
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    
    const inputDate = new Date(year, month, day);
    if (
      isNaN(inputDate.getTime()) ||
      inputDate.getDate() !== day ||
      inputDate.getMonth() !== month ||
      inputDate.getFullYear() !== year
    ) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "รูปแบบวันที่ไม่ถูกต้อง" });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (inputDate > today) {
       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "ไม่สามารถกรอกวันที่ในอนาคตได้" });
    }
  }),
  gender: z.string().min(1, "Gender is required"),
  phone: z.string().regex(THAI_PHONE_REGEX, "กรุณากรอกฟอร์แมตให้ถูก"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  language: z.string().min(1, "Language is required"),
  nationality: z.string().min(1, "Nationality is required"),
  emergencyContact: z.string().optional(),
  emergencyRelationship: z.string().optional(),
  emergencyPhone: z.string().optional(),
  religion: z.string().optional(),
}).superRefine((data, ctx) => {
  const hasContact = !!data.emergencyContact?.trim();
  const hasRelationship = !!data.emergencyRelationship?.trim();
  const hasPhone = !!data.emergencyPhone?.trim();

  if (hasContact || hasRelationship || hasPhone) {
    if (!hasContact) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "กรุณาระบุชื่อผู้ติดต่อฉุกเฉิน",
        path: ["emergencyContact"],
      });
    }
    if (!hasRelationship) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "กรุณาระบุความสัมพันธ์",
        path: ["emergencyRelationship"],
      });
    }
    if (!hasPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "กรุณาระบุเบอร์โทรศัพท์ผู้ติดต่อ",
        path: ["emergencyPhone"],
      });
    } else {
      if (!THAI_PHONE_REGEX.test(data.emergencyPhone || "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "กรุณากรอกฟอร์แมตเบอร์โทรศัพท์ให้ถูก",
          path: ["emergencyPhone"],
        });
      }
    }
  }
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;

export const initialFormData: PatientFormValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  language: "",
  nationality: "",
  emergencyContact: "",
  emergencyRelationship: "",
  emergencyPhone: "",
  religion: "",
};

export const usePatientForm = () => {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: initialFormData,
    mode: "onChange",
  });

  return form;
};
