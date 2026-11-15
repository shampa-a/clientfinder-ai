
import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Zap size={18} />
          </div>

          <span className="font-bold text-slate-900">
            ClientFinder AI
          </span>
        </Link>

        <p className="text-center text-xs text-slate-500">
          © 2026 ClientFinder AI. All rights reserved.
        </p>

        <Link
          href="/dashboard"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Dashboard
        </Link>
      </div>
    </footer>
  );
}
