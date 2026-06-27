export interface PatientSession {
  patientId: string;
  status: "active" | "inactive" | "submitted";
  startedAt: string;
  updatedAt: string;
  formData: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    phone?: string;
    email?: string;
    address?: string[] | string;
    language?: string;
    nationality?: string;
    religion?: string;
    emergencyContact?: string;
    emergencyRelationship?: string;
    emergencyPhone?: string;
  };
  lastActiveField?: string;
}
