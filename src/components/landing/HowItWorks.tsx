
import type { ElementType } from "react";
import { Search, Users, Sparkles } from "lucide-react";

const steps: {
  number: string;
  icon: ElementType;
  title: string;
  description: string;
}[] = [
  {
    number: "01",
    icon: Search,
    title: "Search Businesses",
    description:
      "Choose a country, city and business category to discover potential clients.",
  },
  {
    number: "02",
    icon: Users,
    title: "Explore Prospects",
    description:
      "Review available business information and identify possible opportunities.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Create Outreach",
    description:
      "Use AI to prepare personalized messages and manage your saved prospects.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-slate-50 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Simple Process
          </span>

          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            How ClientFinder AI Works
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500">
            Three simple steps to organize your client prospecting.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Icon size={23} />
                  </div>

                  <span className="text-3xl font-bold text-slate-100">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
