
import Link from "next/link";
import { Search, BarChart3, Bot, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">

          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            AI-Powered Business Prospecting
          </span>

          <h1 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-6xl">
            Find Better Clients.
            <br />
            <span className="text-blue-600">
              Grow Your Business.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Discover potential business clients, identify opportunities,
            and create personalized outreach messages with AI.
          </p>

          {/* Hero Buttons */}
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              href="/dashboard/search"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-blue-700"
            >
              Start Finding Clients
              <ArrowRight size={18} />
            </Link>

            <Link
              href="#features"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-8 py-4 font-semibold text-slate-700 transition hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50"
            >
              Explore Features
            </Link>

          </div>

          <p className="mt-6 text-sm text-slate-500">
            Built for freelancers, agencies and growing businesses.
          </p>

        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="scroll-mt-24 bg-white px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">

          {/* Section Heading */}
          <div className="mx-auto max-w-2xl text-center">

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              Powerful Features
            </span>

            <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Everything You Need to Find Clients
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Powerful tools to simplify your client discovery process.
            </p>

          </div>

          {/* Feature Cards */}
          <div className="mt-14 grid gap-8 md:grid-cols-3">

            {/* Business Discovery */}
            <FeatureCard
              icon={<Search size={30} />}
              title="Business Discovery"
              description="Discover potential business clients by country, city and business category."
            />

            {/* Lead Management */}
            <FeatureCard
              icon={<BarChart3 size={30} />}
              title="Lead Management"
              description="Save prospects, organize opportunities and manage your client pipeline."
            />

            {/* AI Outreach Writer */}
            <FeatureCard
              icon={<Bot size={30} />}
              title="AI Outreach Writer"
              description="Generate personalized business outreach drafts with AI assistance."
            />

          </div>
        </div>
      </section>
    </>
  );
}

/* Feature Card Component */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-8 transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl">

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-600">
        {description}
      </p>

    </div>
  );
}
