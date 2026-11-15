import type { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <DashboardSidebar />

      <main className="min-w-0 flex-1 px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
