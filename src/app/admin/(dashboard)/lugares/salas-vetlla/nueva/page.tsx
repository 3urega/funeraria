import { WakeRoomForm } from "@/components/admin/wake-room-form";

export const metadata = { title: "Admin — Nova sala de vetlla" };

export default function NewWakeRoomPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Nova sala de vetlla</h1>
      <WakeRoomForm />
    </div>
  );
}
