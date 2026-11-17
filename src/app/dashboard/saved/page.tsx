"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Search,
  MapPin,
  Globe,
  Phone,
  Star,
  Trash2,
  ExternalLink,
  Building2,
} from "lucide-react";

import type { Business } from "@/types/business";

export default function SavedLeadsPage() {
  const [savedBusinesses, setSavedBusinesses] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBusinesses = useMemo(() => {
    return savedBusinesses.filter((business) =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [savedBusinesses, searchTerm]);

  const removeBusiness = (placeId: string) => {
    setSavedBusinesses((previous) =>
      previous.filter((business) => business.placeId !== placeId)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Saved Leads
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your saved business prospects.
          </p>
        </div>

        <Link
          href="/dashboard/search"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Search size={18} />
          Find New Leads
        </Link>
      </div>

      {/* Stats */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
            <Bookmark size={22} />
          </div>

          <div>
            <p className="text-sm text-gray-500">Total Saved Leads</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {savedBusinesses.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search saved businesses..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Saved Leads Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {filteredBusinesses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">Business</th>
                  <th className="px-5 py-4 font-semibold">Address</th>
                  <th className="px-5 py-4 font-semibold">Contact</th>
                  <th className="px-5 py-4 font-semibold">Rating</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredBusinesses.map((business) => (
                  <tr key={business.placeId} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Building2
                          size={20}
                          className="shrink-0 text-blue-600"
                        />
                        <span className="font-medium text-gray-900">
                          {business.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      <div className="flex items-center gap-2">
                        <MapPin size={15} />
                        {business.address || "Not available"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1 text-gray-500">
                        {business.phone && (
                          <p className="flex items-center gap-2">
                            <Phone size={14} />
                            {business.phone}
                          </p>
                        )}

                        {business.website && (
                          <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:underline"
                          >
                            <Globe size={14} />
                            Website
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {business.rating ? (
                        <span className="flex items-center gap-1 text-gray-700">
                          <Star
                            size={15}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          {business.rating}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => removeBusiness(business.placeId)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        title="Remove lead"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-5">
              <Bookmark size={32} className="text-gray-400" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              {searchTerm ? "No matching leads found" : "No Saved Leads Yet"}
            </h3>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              {searchTerm
                ? "Try searching with a different business name."
                : "Start discovering potential clients and save interesting businesses here."}
            </p>

            {!searchTerm && (
              <Link
                href="/dashboard/search"
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Start Finding Clients
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}