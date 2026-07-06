import { AdminLoginForm } from "@/components/admin/login-form";

export const metadata = {
  title: "Admin — Login",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-xl font-bold">Administración</h1>
        <AdminLoginForm />
        <p className="mt-4 text-center text-xs text-zinc-400">
          Dev: admin@local.dev / admin123
        </p>
      </div>
    </div>
  );
}
