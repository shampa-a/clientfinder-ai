"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Search,
  Users,
  Bookmark,
  History,
  Settings,
  CreditCard,
  HelpCircle,
  Menu,
  X,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const navigation = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Find Businesses", href: "/dashboard/search", icon: Search },
  { title: "My Leads", href: "/dashboard/leads", icon: Users },
  { title: "Saved Prospects", href: "/dashboard/saved", icon: Bookmark },
  { title: "Search History", href: "/dashboard/history", icon: History },
];

const secondaryNavigation = [
  { title: "AI Message Writer", href: "/dashboard/ai-writer", icon: Sparkles },
  { title: "Billing & Plans", href: "/dashboard/billing", icon: CreditCard },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
  { title: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
];

type NavLinksProps = {
  pathname: string;
  onNavigate?: () => void;
};

function NavLinks({ pathname, onNavigate }: NavLinksProps) {
  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <div className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Workspace
      </div>

      {navigation.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              active
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
            }`}
          >
            <Icon size={19} />
            <span>{item.title}</span>
            {active && <ChevronRight size={16} className="ml-auto" />}
          </Link>
        );
      })}

      <div className="mb-3 mt-8 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Tools & Settings
      </div>

      {secondaryNavigation.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              active
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
            }`}
          >
            <Icon size={19} />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </>
  );
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
        className="fixed left-4 top-4 z-40 rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm lg:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden min-h-screen w-72 shrink-0 flex-col border-r border-slate-200 bg-white px-5 py-6 lg:flex">
        <Link href="/dashboard" className="mb-10 flex items-center gap-2 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Search size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              ClientFinder <span className="text-blue-600">AI</span>
            </h1>
            <p className="text-xs text-slate-400">Find better clients</p>
          </div>
        </Link>

        <nav className="flex-1">
          <NavLinks pathname={pathname} />
        </nav>

        {/* Upgrade Card */}
        <div className="mt-8 rounded-2xl bg-blue-50 p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Sparkles size={19} />
          </div>

          <h3 className="font-semibold text-slate-900">Upgrade your plan</h3>
          <p className="mt-2 text-xs leading-5 text-slate-600">
            Unlock more searches and AI-powered tools.
          </p>

          <Link
            href="/dashboard/billing"
            className="mt-4 block rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
          >
            View Plans
          </Link>
        </div>

        {/* User Profile */}
        <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700">
            U
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Your Account</p>
            <p className="text-xs text-slate-500">Free Plan</p>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close sidebar overlay"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto bg-white px-5 py-6 shadow-xl">
            <div className="mb-10 flex items-center justify-between">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="text-lg font-bold text-slate-900"
              >
                ClientFinder <span className="text-blue-600">AI</span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close sidebar"
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              >
                <X size={21} />
              </button>
            </div>

            <nav className="flex-1">
              <NavLinks
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </nav>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <p className="text-sm font-semibold text-slate-800">Your Account</p>
              <p className="mt-1 text-xs text-slate-500">Free Plan</p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
