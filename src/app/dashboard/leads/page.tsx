"use client";

import { useCallback, useMemo, useState } from "react";

type LeadStatus = "New" | "Contacted" | "Interested" | "Converted";

type Lead = {
  _id: string;
  placeId: string;
  name: string;
  category?: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  status: LeadStatus;
  createdAt: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  leads?: Lead[];
  lead?: Lead;
};

const statuses: LeadStatus[] = [
  "New",
  "Contacted",
  "Interested",
  "Converted",
];

const initialFormData = {
  placeId: "",
  name: "",
  category: "",
  address: "",
  phone: "",
  website: "",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState(initialFormData);

  // =========================================
  // 1. Fetch Leads from MongoDB
  // =========================================

 const fetchLeads = useCallback(async () => {
  try {
    const response = await fetch("/api/leads", {
      method: "GET",
      cache: "no-store",
    });

    const data: ApiResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to load leads");
    }

    setLeads(data.leads || []);
    setError("");
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
}, []);

  // =========================================
  // 2. Add New Lead
  // =========================================

  async function handleAddLead(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save lead");
      }

      setFormData({ ...initialFormData });
      setShowAddForm(false);

      await fetchLeads();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save lead"
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================
  // 3. Update Lead Status
  // =========================================

  async function handleStatusChange(
    id: string,
    newStatus: LeadStatus
  ) {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update status");
      }

      setLeads((previousLeads) =>
        previousLeads.map((lead) =>
          lead._id === id
            ? { ...lead, status: newStatus }
            : lead
        )
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Status update failed"
      );
    }
  }

  // =========================================
  // 4. Delete Lead
  // =========================================

  async function handleDeleteLead(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete lead");
      }

      setLeads((previousLeads) =>
        previousLeads.filter((lead) => lead._id !== id)
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Delete failed"
      );
    }
  }

  // =========================================
  // 5. Search and Filter Leads
  // =========================================

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchTerm = search.toLowerCase().trim();

      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm) ||
        (lead.address || "").toLowerCase().includes(searchTerm) ||
        (lead.phone || "").includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" ||
        lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  // =========================================
  // 6. Dashboard Statistics
  // =========================================

  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) => lead.status === "New"
  ).length;

  const contactedLeads = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  const interestedLeads = leads.filter(
    (lead) => lead.status === "Interested"
  ).length;

  const convertedLeads = leads.filter(
    (lead) => lead.status === "Converted"
  ).length;

  // =========================================
  // 7. Main UI
  // =========================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Leads
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage and track your saved business leads.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          {showAddForm ? "Close Form" : "+ Add Lead"}
        </button>

      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Add Lead Form */}
      {showAddForm && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            Add New Lead
          </h2>

          <form onSubmit={handleAddLead}>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Business Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Business Name *
                </label>

                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Business name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Place ID */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Google Place ID *
                </label>

                <input
                  type="text"
                  required
                  value={formData.placeId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      placeId: e.target.value,
                    })
                  }
                  placeholder="Google Place ID"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    })
                  }
                  placeholder="Restaurant, Agency, etc."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                  placeholder="Phone number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Website */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Website
                </label>

                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      website: e.target.value,
                    })
                  }
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Address */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Business Address
                </label>

                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value,
                    })
                  }
                  placeholder="Business address"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

            </div>

            <div className="mt-6 flex gap-3">

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Lead"}
              </button>

              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      {/* Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">

        <StatCard
          title="Total Leads"
          value={totalLeads}
          color="blue"
        />

        <StatCard
          title="New Leads"
          value={newLeads}
          color="indigo"
        />

        <StatCard
          title="Contacted"
          value={contactedLeads}
          color="yellow"
        />

        <StatCard
          title="Interested"
          value={interestedLeads}
          color="purple"
        />

        <StatCard
          title="Converted"
          value={convertedLeads}
          color="green"
        />

      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm md:flex-row">

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search business name, address or phone..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="All">All Status</option>

          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}

        </select>

        <button
          onClick={() => {
            setLoading(true);
            fetchLeads();
          }}
          disabled={loading}
          className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>

      </div>

      {/* Leads Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

        {/* Table Header */}
        <div className="border-b border-gray-200 p-5">

          <h2 className="text-lg font-semibold text-gray-900">
            Saved Businesses
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {filteredLeads.length} leads found
          </p>

        </div>

        {/* Loading */}
        {loading ? (

          <div className="p-12 text-center text-gray-500">
            Loading leads from MongoDB...
          </div>

        ) : filteredLeads.length === 0 ? (

          /* Empty State */
          <div className="p-12 text-center">

            <h3 className="text-lg font-semibold text-gray-800">
              No leads found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Search for businesses and save them to your leads.
            </p>

          </div>

        ) : (

          /* Leads Data Table */
          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead className="bg-gray-50 text-gray-600">

                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Business
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Contact
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Website
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredLeads.map((lead) => (

                  <tr
                    key={lead._id}
                    className="transition hover:bg-gray-50"
                  >

                    {/* Business Information */}
                    <td className="px-5 py-4">

                      <p className="font-semibold text-gray-900">
                        {lead.name}
                      </p>

                      <p className="mt-1 max-w-xs text-xs text-gray-500">
                        {lead.address || "Address not available"}
                      </p>

                      {lead.category && (
                        <span className="mt-2 inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                          {lead.category}
                        </span>
                      )}

                      {typeof lead.rating === "number" && (
                        <p className="mt-1 text-xs text-yellow-600">
                          Rating: {lead.rating} / 5
                        </p>
                      )}

                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4 text-gray-600">
                      {lead.phone || "Not available"}
                    </td>

                    {/* Website */}
                    <td className="px-5 py-4">

                      {lead.website ? (

                        <a
                          href={
                            lead.website.startsWith("http")
                              ? lead.website
                              : `https://${lead.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visit Website
                        </a>

                      ) : (

                        <span className="text-gray-400">
                          No website
                        </span>

                      )}

                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">

                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(
                            lead._id,
                            e.target.value as LeadStatus
                          )
                        }
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-blue-500"
                      >

                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}

                      </select>

                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">

                      <button
                        onClick={() => handleDeleteLead(lead._id)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

// =========================================
// Statistics Card Component
// =========================================

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: "blue" | "indigo" | "yellow" | "purple" | "green";
}) {
  const colorClasses = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-700",
    purple: "border-purple-200 bg-purple-50 text-purple-700",
    green: "border-green-200 bg-green-50 text-green-700",
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <div
        className={`mt-3 inline-flex rounded-lg border px-4 py-2 ${colorClasses[color]}`}
      >
        <span className="text-2xl font-bold">
          {value}
        </span>
      </div>

    </div>
  );
}