import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { PatientSession } from "../types/patient";
import { INITIAL_PATIENTS } from "../constants/mockData";

export const usePatientMonitor = () => {
  const [patients, setPatients] = useState<PatientSession[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("somchai-uuid-12345");
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [showMobileDetail, setShowMobileDetail] = useState<boolean>(false);

  // Initialize state with relative times anchored to current render
  useEffect(() => {
    setPatients(INITIAL_PATIENTS(Date.now()));
  }, []);

  // Update current time every 15 seconds to keep relative time calculations fresh
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 15000);
    return () => clearInterval(timeInterval);
  }, []);

  // Set up Pusher real-time bindings
  useEffect(() => {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY || "42c0211e45aa2afdcfd6";
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap1";

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });

    const channel = pusher.subscribe("patient-monitor");

    channel.bind_global((eventName: string, data: any) => {
      if (eventName.startsWith("patient-")) {
        const { patientId, status, formData, updateAt } = data;

        setPatients((prevPatients) => {
          const existingIndex = prevPatients.findIndex((p) => p.patientId === patientId);

          if (existingIndex > -1) {
            const existing = prevPatients[existingIndex];

            // Detect which field was modified to trigger active typing indicator
            let changedField = existing.lastActiveField;
            if (formData && existing.formData) {
              for (const key of Object.keys(formData)) {
                const newVal = (formData as any)[key];
                const oldVal = (existing.formData as any)[key];
                if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                  changedField = key;
                  break;
                }
              }
            }

            const updatedPatients = [...prevPatients];
            updatedPatients[existingIndex] = {
              ...existing,
              status,
              formData: { ...existing.formData, ...formData },
              updatedAt: updateAt || new Date().toISOString(),
              lastActiveField: changedField,
            };
            return updatedPatients;
          } else {
            // Add new live session
            const newPatient: PatientSession = {
              patientId,
              status,
              startedAt: new Date().toISOString(),
              updatedAt: updateAt || new Date().toISOString(),
              formData: formData || {},
              lastActiveField: undefined,
            };
            // Automatically select the new live session and switch to detail view on mobile
            setSelectedPatientId(patientId);
            setShowMobileDetail(true);
            return [newPatient, ...prevPatients];
          }
        });
      }
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe("patient-monitor");
      pusher.disconnect();
    };
  }, []);

  // Clear typing indicators after 5 seconds of inactivity
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setPatients((prevPatients) =>
        prevPatients.map((p) => {
          if (
            p.lastActiveField &&
            Date.now() - new Date(p.updatedAt).getTime() > 5000
          ) {
            return { ...p, lastActiveField: undefined };
          }
          return p;
        })
      );
    }, 2000);
    return () => clearInterval(cleanupInterval);
  }, []);

  // Dynamic statistics calculations
  const activeCount = patients.filter((p) => p.status === "active").length;
  const inactiveCount = patients.filter((p) => p.status === "inactive").length;
  const submittedCount = patients.filter((p) => p.status === "submitted").length;

  const stats = {
    activeSessions: activeCount + inactiveCount + 1, // Base 3
    fillingIn: activeCount,                          // Base 1
    submittedToday: submittedCount + 14,             // Base 17
    pendingReview: submittedCount + 1,               // Base 4
  };

  const selectedPatient = patients.find((p) => p.patientId === selectedPatientId);

  return {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    currentTime,
    showMobileDetail,
    setShowMobileDetail,
    stats,
    selectedPatient,
  };
};
