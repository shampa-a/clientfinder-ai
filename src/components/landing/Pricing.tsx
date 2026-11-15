
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Try ClientFinder AI and explore its basic features.",
    features: [
      "Limited business searches",
      "Basic business information",
      "Save selected prospects",
      "Basic dashboard",
    ],
    button: "Get Started",
    popular: false,
  },
  {
    name: "Starter",
    price: "$9",
    description: "For freelancers starting their client prospecting journey.",
    features: [
      "More business searches",
      "Business information",
      "Prospect management",
      "AI outreach drafts",
    ],
    button: "Choose Starter",
    popular: true,
  },
  {
    name: "Pro",
    price: "$19",
    description: "For freelancers who want to grow their client pipeline.",
    features: [
      "Higher search limits",
      "Advanced prospect management",
      "AI outreach drafts",
      "Search history",
    ],
    button: "Choose Pro",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Pricing Plans
          </span>

          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Choose a Plan That Fits Your Needs
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500">
            Start with the free plan and explore the platform.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-7 ${
                plan.popular
                  ? "border-blue-600 bg-blue-50/40 shadow-xl shadow-blue-100"
                  : "border-slate-200 bg-white"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                  Popular
                </span>
              )}

              <h3 className="text-xl font-bold text-slate-900">
                {plan.name}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                {plan.description}
              </p>

              <div className="mt-6">
                <span className="text-4xl font-extrabold text-slate-900">
                  {plan.price}
                </span>

                {plan.price !== "$0" && (
                  <span className="text-sm text-slate-500">
                    {" "}/ month
                  </span>
                )}
              </div>

              <Link
                href="/dashboard"
                className={`mt-7 flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                {plan.button}
              </Link>

              <div className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 text-sm text-slate-600"
                  >
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-green-600"
                    />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Pricing and feature limits are illustrative and subject to
          final product configuration.
        </p>
      </div>
    </section>
  );
}
