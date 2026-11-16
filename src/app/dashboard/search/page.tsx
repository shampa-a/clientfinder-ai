
"use client";

import { useState } from "react";
import { Search, MapPin, Building2 } from "lucide-react";
import BusinessResultsTable from "@/components/dashboard/BusinessResultsTable";

type Business = {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
};

const demoBusinesses: Business[] = [
  {
    id: "1",
    name: "Example Restaurant",
    address: "Gulshan, Dhaka, Bangladesh",
    phone: "+880 1700 000000",
    website: "https://example.com",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Example Hotel",
    address: "Banani, Dhaka, Bangladesh",
    phone: "+880 1800 000000",
    website: "",
    rating: 4.2,
  },
  {
    id: "3",
    name: "Example Dental Clinic",
    address: "Dhanmondi, Dhaka, Bangladesh",
    phone: "+880 1900 000000",
    website: "https://example.org",
    rating: 4.7,
  },
];

export default function BusinessSearchPage() {
  const [country, setCountry] = useState("Bangladesh");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("Restaurants");
  const [keyword, setKeyword] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!city.trim()) {
      alert("Please enter a city name.");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    // Demo search only. Google Places API will be connected later.
    setTimeout(() => {
      setBusinesses(demoBusinesses);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Heading */}
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
          <Search size={17} />
          ClientFinder AI
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Find New Businesses
        </h1>

        <p className="mt-2 text-slate-500">
          Discover potential clients by country, city and business category.
        </p>
      </div>

      {/* Search Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
            <Building2 size={22} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Business Search
            </h2>
            <p className="text-sm text-slate-500">
              Enter your target market details.
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Country
              </label>

              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Bangladesh">Bangladesh</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                City
              </label>

              <div className="relative">
                <MapPin
                  size={17}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Dhaka, London, Toronto"
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Business Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Restaurants">Restaurants</option>
                <option value="Hotels">Hotels</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Dental Clinics">Dental Clinics</option>
                <option value="Beauty Salons">Beauty Salons</option>
                <option value="Law Firms">Law Firms</option>
                <option value="Gyms">Gyms</option>
                <option value="Retail Stores">Retail Stores</option>
                <option value="Digital Marketing Agencies">
                  Digital Marketing Agencies
                </option>
                <option value="Web Design Agencies">
                  Web Design Agencies
                </option>
              </select>
            </div>

            {/* Keyword */}
            <div>
              <label
                htmlFor="keyword"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Keyword (Optional)
              </label>

              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. small business"
                className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Search size={18} />
              {loading ? "Searching..." : "Search Businesses"}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Search Results
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {category} in {city}, {country}
              {keyword ? ` | Keyword: ${keyword}` : ""}
            </p>
          </div>

          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <p className="text-sm text-slate-500">
                Searching businesses...
              </p>
            </div>
          ) : (
            <BusinessResultsTable businesses={businesses} />
          )}
        </div>
      )}

      {!hasSearched && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Search size={26} />
          </div>

          <h3 className="text-lg font-semibold text-slate-800">
            Ready to Find Clients?
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Select a country, enter a city and choose a business category
            to start discovering potential clients.
          </p>
        </div>
      )}
    </div>
  );
}
