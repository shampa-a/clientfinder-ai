"use client";

import { useState, type FormEvent } from "react";
import {
  Search,
  MapPin,
  Building2,
  Globe,
  Loader2,
} from "lucide-react";

import BusinessResultsTable from "@/components/dashboard/BusinessResultsTable";
import type { Business } from "@/types/business";

const countries = [
  "Bangladesh",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
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
  "Other",
];

export default function BusinessSearchPage() {
  const [country, setCountry] = useState("Bangladesh");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("Restaurant");
  const [keyword, setKeyword] = useState("");

  const [businesses, setBusinesses] = useState<Business[]>([]);

  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city.");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);
    setBusinesses([]);

    try {
      const response = await fetch("/api/businesses/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country,
          city: city.trim(),
          category,
          keyword: keyword.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Business search failed."
        );
      }

      // Support both our API response and Google's Places response.
      const places = data.businesses || data.places || [];

      const formattedBusinesses: Business[] = places
        .map(
          (place: {
            placeId?: string;
            id?: string;
            name?: string;
            address?: string;
            displayName?: {
              text?: string;
            };
            formattedAddress?: string;
          }) => ({
            placeId: place.placeId || place.id || "",
            name:
              place.name ||
              place.displayName?.text ||
              "Unknown Business",
            address:
              place.address ||
              place.formattedAddress ||
              "",
          })
        )
        .filter(
          (business: Business) => business.placeId
        );

      setBusinesses(formattedBusinesses);
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Find Potential Clients
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Discover businesses around the world and find potential
          clients for your services.
        </p>
      </div>

      {/* Search Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Business Discovery
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter your target location and business category.
          </p>
        </div>

        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                value={country}
                onChange={(event) =>
                  setCountry(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {countries.map((item) => (
                  <option key={item} value={item}>
                    {item}
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
                type="text"
                value={city}
                onChange={(event) =>
                  setCity(event.target.value)
                }
                placeholder="Example: Dhaka, London, New York"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Business Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Building2 size={16} />
                Business Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Keyword */}
            <div>
              <label
                htmlFor="keyword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Additional Keyword (Optional)
              </label>

              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(event) =>
                  setKeyword(event.target.value)
                }
                placeholder="Example: Small business, WordPress"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Search Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Find Businesses
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <Loader2
            size={32}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-4 text-sm text-gray-600">
            Searching for businesses...
          </p>
        </div>
      )}

      {!loading && hasSearched && !error && (
        <BusinessResultsTable businesses={businesses} />
      )}

      {/* Initial Information */}
      {!hasSearched && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
          <Search
            size={36}
            className="mx-auto text-gray-400"
          />

          <h3 className="mt-4 text-lg font-semibold text-gray-800">
            Start Finding Clients
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Select a country, enter a city and choose a business
            category to discover potential clients.
          </p>
        </div>
      )}
    </div>
  );
}