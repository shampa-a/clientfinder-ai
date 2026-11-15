
import type { ElementType } from "react";
import {
  Search,
  MapPin,
  Globe,
  Target,
  Bookmark,
  MessageSquareText,
} from "lucide-react";

const features: {
  icon: ElementType;
  title: string;
  description: string;
}[] = [
  {
    icon: Search,
    title: "Smart Business Search",
    description:
      "Discover businesses by country, city, location and business category.",
  },
  {
    icon: MapPin,
    title: "Location-Based Leads",
    description:
      "Find potential prospects in Bangladesh, USA, UK, Canada and Australia.",
  },
  {
    icon: Globe,
    title: "Business Information",
    description:
      "View available business names, addresses, phone numbers and websites.",
  },
  {
    icon: Target,
    title: "Potential Client Discovery",
    description:
      "Identify businesses that may need website development and digital services.",
  },
  {
    icon: Bookmark,
    title: "Save Your Prospects",
    description:
      "Save interesting prospects and organize them in your personal workspace.",
  },
  {
    icon: MessageSquareText,
    title: "AI Outreach Writer",
    description:
      "Create personalized outreach message drafts for potential clients.",
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Powerful Features
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything You Need to Find Prospects
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-500">
            Discover businesses and manage your prospecting workflow
            from one organized workspace.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={24} />
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
