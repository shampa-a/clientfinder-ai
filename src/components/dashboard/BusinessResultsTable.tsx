"use client";

import Link from "next/link";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Plus,
} from "lucide-react";

import type { Lead } from "@/types/business";

type BusinessResultsTableProps = {
  leads: Lead[];
};

export default function BusinessResultsTable({
  leads,
}: BusinessResultsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <Building2
          size={36}
          className="mx-auto text-gray-400"
        />

        <h3 className="mt-4 text-lg font-semibold text-gray-800">
          No Leads Found
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Add your first business lead to get started.
        </p>

        <Link
          href="/dashboard/search"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={17} />
          Add New Lead
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="font-semibold text-gray-900">
          Business Leads
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {leads.length} leads available
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-4">Business</th>
              <th className="px-5 py-4">Contact</th>
              <th className="px-5 py-4">Location</th>
              <th className="px-5 py-4">Website</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-gray-50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                      <Building2 size={18} />
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {lead.businessName}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {lead.category || "Uncategorized"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="space-y-1">
                    {lead.contactName && (
                      <p className="text-gray-800">
                        {lead.contactName}
                      </p>
                    )}

                    {lead.email && (
                      <p className="flex items-center gap-1 text-xs text-gray-500">
                        <Mail size={12} />
                        {lead.email}
                      </p>
                    )}

                    {lead.phone && (
                      <p className="flex items-center gap-1 text-xs text-gray-500">
                        <Phone size={12} />
                        {lead.phone}
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin size={14} />

                    {[lead.city, lead.country]
                      .filter(Boolean)
                      .join(", ") || "Not specified"}
                  </div>
                </td>

                <td className="px-5 py-4">
                  {lead.website ? (
                    <a
                      href={
                        /^https?:\/\//i.test(lead.website)
                          ? lead.website
                          : `https://${lead.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Globe size={14} />
                      Visit Website
                    </a>
                  ) : (
                    <span className="text-gray-400">
                      Not provided
                    </span>
                  )}
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {lead.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}