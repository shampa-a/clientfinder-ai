"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import {
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Tag,
  FileText,
  Loader2,
  Save,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

const countries = [
  "Bangladesh",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Other",
];

const categories = [
  "Restaurant",
  "Hotel",
  "Dental Clinic",
  "Real Estate Agency",
  "Digital Marketing Agency",
  "Web Design Agency",
  "Beauty Salon",
  "Gym",
  "Construction Company",
  "E-commerce",
  "Other",
];

const initialForm = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  website: "",
  country: "Bangladesh",
  city: "",
  category: "Web Design Agency",
  notes: "",
};

export default function ManualLeadEntryPage() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.businessName.trim()) {
      setError("Business name is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save lead.");
      }

      setSuccess("Lead saved successfully!");

      setForm(initialForm);

      // Navigate to saved leads after successful creation
      setTimeout(() => {
        router.push("/dashboard/saved");
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm(initialForm);
    setError("");
    setSuccess("");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Add New Lead
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manually add a business prospect to your ClientFinder AI CRM.
        </p>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

        <div className="mb-7 flex items-center gap-3 border-b border-gray-100 pb-5">
          <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
            <Building2 size={24} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Business Information
            </h2>

            <p className="text-sm text-gray-500">
              Enter the business and contact details.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Business Name */}
            <div className="md:col-span-2">
              <label
                htmlFor="businessName"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Building2 size={16} />
                Business Name *
              </label>

              <input
                id="businessName"
                name="businessName"
                type="text"
                value={form.businessName}
                onChange={handleChange}
                placeholder="Example: ABC Digital Agency"
                required
                maxLength={150}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Contact Name */}
            <div>
              <label
                htmlFor="contactName"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <User size={16} />
                Contact Person
              </label>

              <input
                id="contactName"
                name="contactName"
                value={form.contactName}
                onChange={handleChange}
                placeholder="Contact person's name"
                maxLength={150}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Mail size={16} />
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="business@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Phone size={16} />
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+880 1XXXXXXXXX"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Website */}
            <div>
              <label
                htmlFor="website"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Globe size={16} />
                Website
              </label>

              <input
                id="website"
                name="website"
                type="text"
                value={form.website}
                onChange={handleChange}
                placeholder="www.example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Globe size={16} />
                Country
              </label>

              <select
                id="country"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <MapPin size={16} />
                City
              </label>

              <input
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Example: Dhaka"
                maxLength={100}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Tag size={16} />
                Business Category
              </label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label
                htmlFor="notes"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <FileText size={16} />
                Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                maxLength={2000}
                placeholder="Write additional information about this potential client..."
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle2 size={18} />
              {success}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row">

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving Lead...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Lead
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RotateCcw size={17} />
              Reset Form
            </button>

          </div>

          <p className="mt-4 text-xs text-gray-400">
            * Business Name is required. Other information is optional.
          </p>

        </form>
      </div>
    </div>
  );
}