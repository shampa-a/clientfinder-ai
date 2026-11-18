"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  Search,
  Plus,
  RefreshCw,
  Trash2,
  ExternalLink,
  Loader2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
} from "lucide-react";

import type { Lead, LeadStatus } from "@/types/business";

const statusStyles: Record<LeadStatus, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  Interested: "bg-purple-100 text-purple-700",
  Converted: "bg-green-100 text-green-700",
};

export default function SavedLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState("");

  // Load leads when page opens
  useEffect(() => {
    let ignore = false;

    async function loadLeads() {
      try {
        const response = await fetch("/api/leads");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load saved leads."
          );
        }

        if (!ignore) {
          setLeads(data.leads || []);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadLeads();

    return () => {
      ignore = true;
    };
  }, []);

  // Refresh leads
  async function handleRefresh() {
    setRefreshing(true);
    setError("");

    try {
      const response = await fetch("/api/leads");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to refresh leads."
        );
      }

      setLeads(data.leads || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to refresh leads."
      );
    } finally {
      setRefreshing(false);
    }
  }

  // Delete lead
  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete lead."
        );
      }

      setLeads((previous) =>
        previous.filter((lead) => lead.id !== id)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete lead."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // Search leads
  const filteredLeads = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return leads;

    return leads.filter((lead) => {
      const searchableFields = [
        lead.businessName,
        lead.contactName,
        lead.email,
        lead.phone,
        lead.website,
        lead.city,
        lead.country,
        lead.category,
        lead.status,
      ];

      return searchableFields.some((field) =>
        field?.toLowerCase().includes(search)
      );
    });
  }, [leads, searchTerm]);

  // Format website URL
  function getWebsiteUrl(website?: string) {
    if (!website) return "";

    const trimmedWebsite = website.trim();

    if (/^https?:\/\//i.test(trimmedWebsite)) {
      return trimmedWebsite;
    }

    return `https://${trimmedWebsite}`;
  }

  // Format date
  function formatDate(date?: string | Date) {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString();
  }

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Saved Leads
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage and track your potential clients.
          </p>
        </div>

        <div className="flex gap-3">

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <Link
            href="/dashboard/search"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Add New Lead
          </Link>

        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Leads
              </p>

              <h3 className="mt-2 text-2xl font-bold text-gray-900">
                {leads.length}
              </h3>
            </div>

            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                New Leads
              </p>

              <h3 className="mt-2 text-2xl font-bold text-gray-900">
                {leads.filter((lead) => lead.status === "New").length}
              </h3>
            </div>

            <div className="rounded-lg bg-green-100 p-3 text-green-600">
              <Building2 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Converted Leads
              </p>

              <h3 className="mt-2 text-2xl font-bold text-gray-900">
                {leads.filter((lead) => lead.status === "Converted").length}
              </h3>
            </div>

            <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
              <Users size={22} />
            </div>
          </div>
        </div>

      </div>

      {/* Search */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search by business, contact, email, city or category..."
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Loader2
            size={32}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-4 text-sm text-gray-500">
            Loading your saved leads...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && leads.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">

          <Building2
            size={40}
            className="mx-auto text-gray-400"
          />

          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No Leads Found
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            You have not added any business leads yet.
            Start by adding your first potential client.
          </p>

          <Link
            href="/dashboard/search"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Add Your First Lead
          </Link>

        </div>
      )}

      {/* No Search Results */}
      {!loading &&
        !error &&
        leads.length > 0 &&
        filteredLeads.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <Search
              size={32}
              className="mx-auto text-gray-400"
            />

            <h3 className="mt-4 font-semibold text-gray-900">
              No Matching Leads
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try another search keyword.
            </p>
          </div>
        )}

      {/* Leads Table */}
      {!loading && filteredLeads.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold text-gray-800">
              All Leads
            </h2>

            <span className="text-sm text-gray-500">
              {filteredLeads.length} results
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">

              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Business</th>
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Website</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="transition hover:bg-gray-50"
                  >

                    {/* Business */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                          <Building2 size={19} />
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

                    {/* Contact */}
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

                        {!lead.contactName &&
                          !lead.email &&
                          !lead.phone && (
                            <span className="text-gray-400">
                              No contact details
                            </span>
                          )}

                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-gray-600">

                        <MapPin
                          size={14}
                          className="shrink-0 text-gray-400"
                        />

                        <span>
                          {[lead.city, lead.country]
                            .filter(Boolean)
                            .join(", ") || "Not specified"}
                        </span>

                      </div>
                    </td>

                    {/* Website */}
                    <td className="px-5 py-4">
                      {lead.website ? (
                        <a
                          href={getWebsiteUrl(lead.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <Globe size={14} />
                          Visit Website
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-gray-400">
                          Not provided
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[lead.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-5 py-4 text-gray-500">
                      {formatDate(lead.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(lead.id)}
                        disabled={deletingId === lead.id}
                        title="Delete lead"
                        aria-label={`Delete ${lead.businessName}`}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === lead.id ? (
                          <Loader2
                            size={17}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={17} />
                        )}
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}