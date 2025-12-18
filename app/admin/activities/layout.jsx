import Sidebar from "@/app/components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 ml-20 lg:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
