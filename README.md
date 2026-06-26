# Agnos CareSync: Real-Time Patient Registration & Monitoring System

Agnos CareSync is a real-time patient registration and live monitoring system. It allows patients to fill out registration forms on their own devices, while medical staff can track their inputs and progress letter-by-letter live on a dashboard.

---

## 🚀 Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Form Management & Validation**: React Hook Form + Zod (Strict schema validation and optimized state handling)
- **Real-Time WebSockets**: Pusher Channels (`pusher` & `pusher-js`) for bi-directional live updates

---

## 🛠️ Setup Instructions

### 1. Clone & Install Dependencies
First, clone the repository and install all required npm packages:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root of the project and fill in your Pusher credentials:
```env
PUSHER_APP_ID="YOUR_PUSHER_APP_ID"
NEXT_PUBLIC_PUSHER_KEY="YOUR_NEXT_PUBLIC_PUSHER_KEY"
PUSHER_SECRET="YOUR_PUSHER_SECRET"
NEXT_PUBLIC_PUSHER_CLUSTER="YOUR_NEXT_PUBLIC_PUSHER_CLUSTER"
```

> [!IMPORTANT]
> Make sure the environment variables are placed in the `.env.local` file at the **root of the project** (not inside the `/app` folder), so Next.js can correctly load them in both client-side and server-side contexts.

### 3. Run the Development Server
Start the local Next.js dev server:
```bash
npm run dev
```
Open [http://localhost:3000/patient](http://localhost:3000/patient) for the Patient Registration Form, and [http://localhost:3000/staff](http://localhost:3000/staff) for the Live Patient Dashboard.

---

## 📐 Development Planning

### 1. Project Structure
The project folders are logically organized to enforce modularity and maintainability:
```text
/app
  /api/sync-patient/     # Serverless endpoint to trigger Pusher events
  /components/forms/     # Modular form sections (PersonalInfo, ContactInfo, EmergencyContact)
  /hooks/                # Custom React hooks (usePatientForm, usePatientSync)
  /patient/              # Client patient form page
  /staff/                # Staff dashboard page
  /util/                 # Reusable utility functions (useDebounce)
```
- **Separation of Hooks from Components**: We isolated form-validation logic (`usePatientForm`) and synchronization side-effects (`usePatientSync`) into custom hooks. This keeps components purely representational and simplifies unit testing and code reusability.

### 2. Layout & Design Decisions
- **Desktop Layout**: Designed a high-fidelity dashboard layout. The staff view splits the screen into a patient list panel (left) and a comprehensive details pane (right), showing all form sections in compact cards.
- **Mobile Layout**: Implemented full responsiveness using Tailwind breakpoints:
  - The sidebar collapses into a slide-over **Drawer Sidebar** triggered by a hamburger button in the mobile header.
  - Utilized a mobile-optimized **Master-Detail flow**. Instead of squishing elements side-by-side on mobile, it displays the list view first. Selecting a patient transitions the view to full-screen details with a "← Back to Patients" button.
  - Statistics cards automatically wrap into a 2x2 grid on mobile viewports.

### 3. Component Architecture
- **Provider & Client Component Isolation**: In accordance with Next.js App Router guidelines, we declare `"use client"` at the entry-level pages (`/patient` and `/staff`) to enable React state, hooks, and WebSocket subscriptions, while keeping base layout structures rendered server-side. Form section components are cleanly isolated, accepting form contexts as props.

### 4. Real-Time Synchronization Flow
To achieve letter-by-letter live tracking without performance degradation or infinite request loops, we designed a robust sync mechanism:
- **The Infinite Loop Challenge**: React Hook Form's `form.watch()` yields a fresh object reference on every render. Passing this object directly to a debouncing hook resets the timer continuously, causing an infinite render/API loop.
- **The Solution (Serialized Debounce)**: We serialize the watched form data to a primitive string (`JSON.stringify(currentFormData)`) before debouncing:
  ```typescript
  const serializedFormData = JSON.stringify(currentFormData);
  const debouncedSerializedFormData = useDebounce(serializedFormData, 400);
  ```
  Since JavaScript compares strings by value rather than reference, this prevents the debounce timer from resetting when the data is identical.
- **Double Render Guards**: We split the mounting guards into two separate refs (`isFirstRenderActive` and `isFirstRenderDebounce`) to guarantee no initial sync payloads are sent to `/api/sync-patient` when the page mounts.
- **Active & Inactive State Transitions**: When the user presses a key, the status is immediately set to `"active"` ("Syncing Live" badge appears). A final `"inactive"` payload is dispatched 3 seconds after the user stops typing, reverting the status back to `"inactive"` ("Synced" badge).

---

## 🎁 Bonus Features
- **Multi-Patient Live Dashboard**: The Staff View is capable of tracking **multiple concurrent active sessions** at the same time. If multiple users open the form, the dashboard list scales dynamically and shows live update indicators, blinking typing states, and status badges for each individual patient.
