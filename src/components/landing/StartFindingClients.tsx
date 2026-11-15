
import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";

export default function StartFindingClients() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-16 text-center shadow-xl sm:px-12">

        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
          <Sparkles size={30} />
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Ready to Start Finding Clients?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-blue-100">
          Discover potential clients, find business opportunities,
          and grow your freelance business with ClientFinder AI.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/dashboard/search"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-bold text-blue-700 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
          >
            <Search size={19} />
            Start Finding Clients
            <ArrowRight size={18} />
          </Link>

          <Link
            href="#features"
            className="rounded-xl border border-white/30 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Explore Features
          </Link>
        </div>

        <p className="mt-6 text-sm text-blue-100">
          Find businesses. Discover opportunities. Grow your business.
        </p>
      </div>
    </section>
  );
}
