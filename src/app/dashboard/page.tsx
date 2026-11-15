
import Link from "next/link";
import {
  Users,
  Globe,
  Target,
  Bookmark,
  Search,
  ArrowRight,
  MapPin,
  Clock,
  Plus,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Total Prospects",
    value: "1,250",
    change: "+12.5%",
    description: "Compared to last month",
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Websites Found",
    value: "890",
    change: "+8.2%",
    description: "Businesses with websites",
    icon: Globe,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "Potential Clients",
    value: "325",
    change: "+15.3%",
    description: "Potential opportunities",
    icon: Target,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Saved Leads",
    value: "156",
    change: "+5.4%",
    description: "Your saved prospects",
    icon: Bookmark,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

const recentSearches = [
  {
    category: "Restaurants",
    location: "New York, USA",
    date: "Today",
    results: 125,
  },
  {
    category: "Digital Marketing Agencies",
    location: "London, UK",
    date: "Yesterday",
    results: 86,
  },
  {
    category: "Real Estate",
    location: "Toronto, Canada",
    date: "2 days ago",
    results: 94,
  },
  {
    category: "Web Design Agencies",
    location: "Dhaka, Bangladesh",
    date: "3 days ago",
    results: 67,
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Welcome back! Here is what&apos;s happening with your prospects.
          </p>
        </div>

        <Link
          href="/dashboard/search"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Find New Businesses
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${stat.iconBg}`}>
                  <Icon size={24} className={stat.iconColor} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                  <TrendingUp size={14} />
                  {stat.change}
                </span>
                <span className="text-xs text-slate-400">
                  {stat.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Dashboard Content */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Recent Searches */}
        <div className="rounded-2xl border border-slate-200 bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="font-bold text-slate-900">
                Recent Searches
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Your latest business discovery searches
              </p>
            </div>

            <Link
              href="/dashboard/history"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentSearches.map((search) => (
              <div
                key={`${search.category}-${search.location}`}
                className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-blue-50 p-3">
                    <Search size={20} className="text-blue-600" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      {search.category}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {search.location}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {search.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {search.results} results
                  </span>

                  <Link
                    href="/dashboard/search"
                    aria-label={`Search ${search.category} again`}
                    className="text-slate-400 transition hover:text-blue-600"
                  >
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Get started with your next task
          </p>

          <div className="mt-5 space-y-3">

            <Link
              href="/dashboard/search"
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="rounded-lg bg-blue-100 p-2">
                <Search size={20} className="text-blue-600" />
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-800">
                  Find Businesses
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Discover new prospects
                </p>
              </div>

              <ArrowRight size={16} className="text-slate-400" />
            </Link>

            <Link
              href="/dashboard/leads"
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="rounded-lg bg-green-100 p-2">
                <Users size={20} className="text-green-600" />
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-800">
                  Manage Leads
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Organize your prospects
                </p>
              </div>

              <ArrowRight size={16} className="text-slate-400" />
            </Link>

            <Link
              href="/dashboard/ai-writer"
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="rounded-lg bg-purple-100 p-2">
                <Target size={20} className="text-purple-600" />
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-800">
                  AI Message Writer
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Create outreach drafts
                </p>
              </div>

              <ArrowRight size={16} className="text-slate-400" />
            </Link>

          </div>
        </div>
      </div>

      {/* Getting Started Banner */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-white">
              Ready to find your next client?
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
              Search businesses by location and category. Discover potential
              opportunities and build your prospect list.
            </p>
          </div>

          <Link
            href="/dashboard/search"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
          >
            Start Searching
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400">
        Dashboard preview uses illustrative sample data. Live business data
        and account statistics are not connected yet.
      </p>
    </div>
  );
}
