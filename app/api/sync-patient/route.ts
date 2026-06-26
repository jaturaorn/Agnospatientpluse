import { NextResponse } from "next/server";
import Pusher from "pusher";
import { success } from "zod";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || "YOUR_APP_ID",
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || "YOUR_KEY",
  secret: process.env.PUSHER_SECRET || "YOUR_SECRET",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "YOUR_CLUSTER",
  useTLS: true,
});

export async function POST(request:Request) {
    try {
        const body = await request.json()
        const {patientId, status, formData} = body

        await pusher.trigger("patient-monitor", `patient-${patientId}`, {
            patientId,
            status,
            formData,
            updateAt: new Date().toISOString()
        })

        return NextResponse.json({ success: true}, {status: 200})
    } catch (error) {
        return NextResponse.json({ success: false, error: "Sync failed" }, { status: 500 });
    }
    
}