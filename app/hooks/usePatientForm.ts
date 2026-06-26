"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

export const patientFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  phone: z.string().min(10, "Phone Number is required"),
  email: z.string().email("Invalid email format"),
  address: z.array(z.string()).min(1, "Address is required"),
  language: z.string().min(1, "Language is required"),
  nationality: z.string().min(1, "Nationality is required"),
  emergencyContact: z.string().optional(),
  religion: z.string().optional(),
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
  address: [],
  language: "",
  nationality: "",
  emergencyContact: "",
  religion: "",
};

export const usePatientForm = () => {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: initialFormData,
    mode: "onTouched",
  });

  return form;
};
