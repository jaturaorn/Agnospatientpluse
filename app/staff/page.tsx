"use client";

import { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";

interface PatientSession {
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

const INITIAL_PATIENTS = (nowMs: number): PatientSession[] => [
  {
    patientId: "somchai-uuid-12345",
    status: "active",
    startedAt: new Date(nowMs - 2 * 60000).toISOString(), // 2 min ago
    updatedAt: new Date(nowMs - 2 * 60000).toISOString(),
    formData: {
      firstName: "Somchai",
      lastName: "Jaidee",
      middleName: "",
      dateOfBirth: "1985-03-15",
      gender: "Male",
      phone: "+66 89 123 4567",
      email: "",
      address: ["123 Sukhumvit Rd, Bangkok 10110"],
      language: "Thai",
      nationality: "Thai",
      religion: "Buddhism",
      emergencyContact: "",
      emergencyRelationship: "",
      emergencyPhone: "",
    },
    lastActiveField: "email",
  },
  {
    patientId: "nipa-uuid-12345",
    status: "submitted",
    startedAt: new Date(nowMs - 15 * 60000).toISOString(),
    updatedAt: new Date(nowMs - 8 * 60000).toISOString(), // 8 min ago
    formData: {
      firstName: "Nipa",
      lastName: "Wongsri",
      middleName: "",
      dateOfBirth: "1990-05-12",
      gender: "Female",
      phone: "+66 81 234 5678",
      email: "nipa.wongsri@email.com",
      address: ["456 Phahonyothin Rd, Bangkok 10400"],
      language: "Thai",
      nationality: "Thai",
      religion: "Buddhism",
      emergencyContact: "Somsak Wongsri",
      emergencyRelationship: "Father",
      emergencyPhone: "+66 81 987 6543",
    },
  },
  {
    patientId: "prasit-uuid-12345",
    status: "inactive",
    startedAt: new Date(nowMs - 25 * 60000).toISOString(),
    updatedAt: new Date(nowMs - 15 * 60000).toISOString(), // 15 min ago
    formData: {
      firstName: "Prasit",
      lastName: "Tanaka",
      middleName: "Takeshi",
      dateOfBirth: "1988-11-05",
      gender: "Male",
      phone: "+66 92 345 6789",
      email: "prasit.tanaka@email.com",
      address: ["789 Sukhumvit Rd, Bangkok 10110"],
      language: "Japanese",
      nationality: "Japanese",
      religion: "Shinto",
      emergencyContact: "Keiko Tanaka",
      emergencyRelationship: "Mother",
      emergencyPhone: "+66 92 987 6543",
    },
  },
  {
    patientId: "malee-uuid-12345",
    status: "submitted",
    startedAt: new Date(nowMs - 40 * 60000).toISOString(),
    updatedAt: new Date(nowMs - 22 * 60000).toISOString(), // 22 min ago
    formData: {
      firstName: "Malee",
      lastName: "Saengdao",
      middleName: "",
      dateOfBirth: "1975-01-20",
      gender: "Female",
      phone: "+66 83 456 7890",
      email: "malee.saengdao@email.com",
      address: ["101 Ramkhamhaeng Rd, Bangkok 10240"],
      language: "Thai",
      nationality: "Thai",
      religion: "Buddhism",
      emergencyContact: "Somchai Saengdao",
      emergencyRelationship: "Husband",
      emergencyPhone: "+66 83 987 6543",
    },
  },
  {
    patientId: "krit-uuid-12345",
    status: "submitted",
    startedAt: new Date(nowMs - 60 * 60000).toISOString(),
    updatedAt: new Date(nowMs - 35 * 60000).toISOString(), // 35 min ago
    formData: {
      firstName: "Krit",
      lastName: "Boonsong",
      middleName: "",
      dateOfBirth: "1995-09-12",
      gender: "Male",
      phone: "+66 84 567 8901",
      email: "krit.boonsong@email.com",
      address: ["202 Lat Phrao Rd, Bangkok 10310"],
      language: "Thai",
      nationality: "Thai",
      religion: "Christian",
      emergencyContact: "Sunee Boonsong",
      emergencyRelationship: "Mother",
      emergencyPhone: "+66 84 987 6543",
    },
  },
];

export default function Page() {
  const [patients, setPatients] = useState<PatientSession[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("somchai-uuid-12345");
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [activeMenu, setActiveMenu] = useState<string>("Live Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
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

  // Calculate relative times
  const getRelativeTime = (isoString: string) => {
    const diffMs = currentTime - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    return `${diffMins} min ago`;
  };

  const getRelativeStartedTime = (isoString: string) => {
    const diffMs = currentTime - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "started just now";
    return `started ${diffMins} minutes ago`;
  };

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

  // Helper formats
  const formatDateOfBirth = (dobString?: string) => {
    if (!dobString) return "—";
    if (dobString.includes("/")) return dobString;
    const parts = dobString.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day} / ${month} / ${year}`;
    }
    return dobString;
  };

  const formatAddress = (address?: string[] | string) => {
    if (!address) return "—";
    if (Array.isArray(address)) return address[0] || "—";
    return address || "—";
  };

  const renderField = (label: string, rawValue: string | undefined, fieldKey: string) => {
    if (!selectedPatient) return null;
    const isTyping = selectedPatient.status === "active" && selectedPatient.lastActiveField === fieldKey;

    let displayValue = rawValue || "—";
    if (isTyping && !rawValue) {
      displayValue = "Typing...";
    }

    const showDot = displayValue !== "—";
    const dotColor = isTyping ? "bg-[#F59E0B]" : "bg-[#10B981]";

    return (
      <div className="bg-[#171E2E] border border-slate-800 p-3 rounded-lg flex flex-col justify-center min-h-[58px] shadow-sm">
        <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold mb-0.5">{label}</span>
        <div className="flex items-center gap-1.5">
          {showDot && (
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0 ${isTyping ? "animate-pulse" : ""}`}></span>
          )}
          <span className={`text-sm font-semibold tracking-wide ${isTyping ? "text-[#F59E0B]" : showDot ? "text-[#F8FAFC]" : "text-[#475569]"}`}>
            {displayValue}
          </span>
        </div>
      </div>
    );
  };

  const menuItems = [
    { name: "Live Dashboard", icon: "📊" },
    { name: "Patient Queue", icon: "👥" },
    { name: "Completed Forms", icon: "📝" },
    { name: "Analytics", icon: "📈" },
    { name: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0B0F19] text-[#F8FAFC] flex flex-col md:flex-row font-sans relative overflow-hidden">
      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0F1420] border-b border-[#1E293B]/60 shrink-0">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg focus:outline-none cursor-pointer animate-none"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-lg">🏥</span>
          <span className="text-sm font-bold text-white tracking-wider">Agnos Staff</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#1E3A8A] border border-[#3B82F6]/30 flex items-center justify-center text-white font-bold text-xs">
          N
        </div>
      </header>

      {/* Mobile Sidebar Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 1. Left Sidebar (Collapsible drawer on mobile, static on desktop) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 border-r border-[#1E293B]/60 bg-[#111622] flex flex-col justify-between py-6 px-4 shrink-0 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div>
          {/* Top Brand with Close Button on Mobile */}
          <div className="flex items-center justify-between px-2 mb-8">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🏥</span>
              <span className="text-md font-bold text-white tracking-wider">Agnos Staff</span>
            </div>
            <button
              className="md:hidden text-slate-400 hover:text-white p-1 hover:bg-slate-800/40 rounded-lg cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const isActive = activeMenu === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveMenu(item.name);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all duration-200 group cursor-pointer ${isActive
                    ? "bg-[#1E293B] text-white"
                    : "text-[#64748B] hover:text-[#94A3B8] hover:bg-[#1E293B]/30"
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Nurse Profile */}
        <div className="border-t border-[#1E293B] pt-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1E3A8A] border border-[#3B82F6]/30 flex items-center justify-center text-white font-bold text-xs">
            N
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white leading-tight">Nurse Somjit</span>
            <span className="text-[10px] text-[#64748B]">Registration Desk</span>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Dashboard */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Dashboard Title & Stats Area */}
        <div className="p-4 md:p-6 border-b border-[#1E293B]/60 bg-[#0F1420] shrink-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5">
            <div>
              <h2 className="text-base md:text-lg font-bold tracking-wide text-white">Live Patient Dashboard</h2>
              <p className="text-[10px] text-[#64748B] mt-0.5">Monitor client patient-registration form inputs in real-time</p>
            </div>

            {/* Live Indicator */}
            <div className="flex items-center justify-between sm:justify-start gap-3 bg-[#0F172A] border border-[#1E293B]/40 px-3.5 py-1.5 rounded-xl shadow-inner">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#10B981]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                LIVE
              </div>
              <div className="w-[1px] h-3 bg-[#1E293B]"></div>
              <span className="text-[9px] text-[#64748B]">Last sync: just now</span>
            </div>
          </div>

          {/* Stat Cards row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <div className="bg-[#161D2B] border border-[#10B981]/20 rounded-xl p-3.5 flex flex-col justify-between h-18 shadow-sm">
              <span className="text-lg font-extrabold text-[#10B981] leading-none">{stats.activeSessions}</span>
              <span className="text-[9px] lg:text-[10px] font-semibold text-[#64748B]">Active Sessions</span>
            </div>
            <div className="bg-[#161D2B] border border-[#EAB308]/20 rounded-xl p-3.5 flex flex-col justify-between h-18 shadow-sm">
              <span className="text-lg font-extrabold text-[#EAB308] leading-none">{stats.fillingIn}</span>
              <span className="text-[9px] lg:text-[10px] font-semibold text-[#64748B]">Filling In</span>
            </div>
            <div className="bg-[#161D2B] border border-[#3B82F6]/20 rounded-xl p-3.5 flex flex-col justify-between h-18 shadow-sm">
              <span className="text-lg font-extrabold text-[#3B82F6] leading-none">{stats.submittedToday}</span>
              <span className="text-[9px] lg:text-[10px] font-semibold text-[#64748B]">Submitted Today</span>
            </div>
            <div className="bg-[#161D2B] border border-[#EF4444]/20 rounded-xl p-3.5 flex flex-col justify-between h-18 shadow-sm">
              <span className="text-lg font-extrabold text-[#EF4444] leading-none">{stats.pendingReview}</span>
              <span className="text-[9px] lg:text-[10px] font-semibold text-[#64748B]">Pending Review</span>
            </div>
          </div>
        </div>

        {/* 3. Main Live Data Container */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-[#0B0F19] overflow-hidden relative">
          {/* Left: Active Patients list */}
          <section className={`w-full lg:w-80 md:w-full border-r border-[#1E293B]/60 p-4 overflow-y-auto flex flex-col shrink-0 ${showMobileDetail ? "hidden md:flex" : "flex"
            }`}>
            <h3 className="text-[10px] font-extrabold tracking-wider text-[#64748B] uppercase mb-4 px-1">
              Active Patients
            </h3>

            <div className="flex flex-col gap-2">
              {patients.map((p) => {
                const isSelected = selectedPatientId === p.patientId;
                const relativeTime = getRelativeTime(p.updatedAt);
                const fullName =
                  p.formData.firstName || p.formData.lastName
                    ? `${p.formData.firstName || ""} ${p.formData.lastName || ""}`.trim()
                    : "Unknown Patient";

                // Map status badges
                let badgeText = "Inactive";
                let badgeStyles = "bg-[#475569]/10 text-[#64748B] border-[#475569]/20";
                let underlineColor = "bg-[#475569]/40";

                if (p.status === "active") {
                  badgeText = "Filling In";
                  badgeStyles = "bg-[#EAB308]/15 text-[#EAB308] border-[#EAB308]/30";
                  underlineColor = "bg-[#EAB308]";
                } else if (p.status === "submitted") {
                  badgeText = "Submitted";
                  badgeStyles = "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30";
                  underlineColor = "bg-[#10B981]";
                }

                return (
                  <button
                    key={p.patientId}
                    onClick={() => {
                      setSelectedPatientId(p.patientId);
                      setShowMobileDetail(true);
                    }}
                    className={`w-full text-left relative overflow-hidden bg-[#161D2B] border rounded-xl p-4 hover:bg-[#1E283A]/30 transition-all duration-200 flex flex-col justify-between cursor-pointer ${isSelected
                      ? "border-[#3B82F6] ring-1 ring-[#3B82F6]/50 shadow-md"
                      : "border-slate-800/80"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <span className="text-xs font-bold text-white tracking-wide truncate">
                        {fullName}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeStyles} shrink-0`}>
                        {badgeText}
                      </span>
                    </div>

                    <span className="text-[10px] text-[#64748B] tracking-wide">
                      {relativeTime}
                    </span>

                    {/* Colored Bottom Highlight Bar */}
                    <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${underlineColor}`}></div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Right: Selected Patient Details view */}
          <section className={`flex-1 p-4 md:p-6 overflow-y-auto ${showMobileDetail ? "flex flex-col" : "hidden md:flex md:flex-col"
            }`}>
            {/* Back Button on Mobile */}
            {showMobileDetail && (
              <button
                onClick={() => setShowMobileDetail(false)}
                className="md:hidden self-start flex items-center gap-1.5 text-xs text-[#3B82F6] hover:text-[#2563EB] font-bold mb-4 bg-[#1E293B]/40 px-3 py-1.5 rounded-lg border border-slate-800/80 cursor-pointer"
              >
                ← Back to Patients
              </button>
            )}

            {selectedPatient ? (
              <div className="max-w-3xl flex flex-col gap-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-[#1E293B]/40 pb-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      {selectedPatient.formData.firstName || selectedPatient.formData.lastName
                        ? `${selectedPatient.formData.firstName || ""} ${selectedPatient.formData.lastName || ""}`.trim()
                        : "Unknown Patient"}
                    </h3>
                    <p className="text-[10px] md:text-xs text-[#64748B] mt-1">
                      {getRelativeStartedTime(selectedPatient.startedAt)}
                    </p>
                  </div>

                  {/* Status Badges */}
                  {selectedPatient.status === "active" && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAB308]/15 text-[#EAB308] border border-[#EAB308]/30 text-[10px] md:text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308] animate-pulse"></span>
                      Filling In
                    </div>
                  )}
                  {selectedPatient.status === "inactive" && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#475569]/15 text-[#64748B] border border-[#475569]/30 text-[10px] md:text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#64748B]"></span>
                      Inactive
                    </div>
                  )}
                  {selectedPatient.status === "submitted" && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px] md:text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                      Submitted
                    </div>
                  )}
                </div>

                {/* Form Sections */}
                <div className="flex flex-col gap-6">
                  {/* Section 1: Personal Information */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[#10B981] text-xs">┃</span>
                      <h4 className="text-[10px] font-extrabold tracking-wider uppercase text-[#64748B]">
                        Personal Information
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      {renderField("First Name", selectedPatient.formData.firstName, "firstName")}
                      {renderField("Last Name", selectedPatient.formData.lastName, "lastName")}
                      {renderField("Middle Name", selectedPatient.formData.middleName, "middleName")}
                      {renderField("Date of Birth", formatDateOfBirth(selectedPatient.formData.dateOfBirth), "dateOfBirth")}
                      {renderField("Gender", selectedPatient.formData.gender, "gender")}
                      {renderField("Nationality", selectedPatient.formData.nationality, "nationality")}
                      {renderField("Preferred Language", selectedPatient.formData.language, "language")}
                      {renderField("Religion", selectedPatient.formData.religion, "religion")}
                    </div>
                  </div>

                  {/* Section 2: Contact Information */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[#10B981] text-xs">┃</span>
                      <h4 className="text-[10px] font-extrabold tracking-wider uppercase text-[#64748B]">
                        Contact Information
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      {renderField("Phone Number", selectedPatient.formData.phone, "phone")}
                      {renderField("Email Address", selectedPatient.formData.email, "email")}
                      <div className="sm:col-span-2">
                        {renderField("Address", formatAddress(selectedPatient.formData.address), "address")}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Emergency Contact */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[#10B981] text-xs">┃</span>
                      <h4 className="text-[10px] font-extrabold tracking-wider uppercase text-[#64748B]">
                        Emergency Contact
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      {renderField("Contact Name", selectedPatient.formData.emergencyContact, "emergencyContact")}
                      {renderField("Relationship", selectedPatient.formData.emergencyRelationship, "emergencyRelationship")}
                      {renderField("Contact Phone", selectedPatient.formData.emergencyPhone, "emergencyPhone")}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-64 flex flex-col items-center justify-center text-center">
                <span className="text-3xl mb-2">👤</span>
                <span className="text-sm font-semibold text-[#64748B]">No Patient Selected</span>
                <span className="text-xs text-[#475569] mt-1">Select a patient from the active list to monitor their session</span>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}