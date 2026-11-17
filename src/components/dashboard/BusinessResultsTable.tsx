"use client";

import { useState } from "react";
import type {
  Business,
  BusinessDetails,
} from "@/types/business";

type BusinessResultsTableProps = {
  businesses: Business[];
};

export default function BusinessResultsTable({
  businesses,
}: BusinessResultsTableProps) {
  const [details, setDetails] = useState<
    Record<string, BusinessDetails>
  >({});

  const [loadingId, setLoadingId] = useState<string | null>(
    null
  );

  const [expandedId, setExpandedId] = useState<string | null>(
    null
  );

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});

  async function handleViewDetails(placeId: string) {
    // Close details if already open
    if (expandedId === placeId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(placeId);

    // Use cached details if already fetched
    if (details[placeId]) {
      return;
    }

    setLoadingId(placeId);

    setErrors((previous) => ({
      ...previous,
      [placeId]: "",
    }));

    try {
      const response = await fetch(
        `/api/businesses/${encodeURIComponent(placeId)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to fetch business details."
        );
      }

      setDetails((previous) => ({
        ...previous,
        [placeId]: data.business,
      }));
    } catch (error) {
      setErrors((previous) => ({
        ...previous,
        [placeId]:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      }));
    } finally {
      setLoadingId(null);
    }
  }

  if (businesses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <h3 className="text-lg font-semibold text-gray-800">
          No businesses found
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Try searching with another city or business category.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Search Results
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {businesses.length} businesses found
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-semibold">
                Business Name
              </th>

              <th className="px-6 py-4 font-semibold">
                Address
              </th>

              <th className="px-6 py-4 font-semibold">
                Place ID
              </th>

              <th className="px-6 py-4 text-right font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {businesses.map((business) => {
              const isExpanded =
                expandedId === business.placeId;

              const isLoading =
                loadingId === business.placeId;

              const businessDetails =
                details[business.placeId];

              return (
                <tr
                  key={business.placeId}
                  className="align-top hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {business.name}
                    </p>
                  </td>

                  <td className="max-w-xs px-6 py-4 text-gray-600">
                    {business.address || "Address unavailable"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className="block max-w-40 truncate text-xs text-gray-500"
                      title={business.placeId}
                    >
                      {business.placeId}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        handleViewDetails(business.placeId)
                      }
                      disabled={isLoading}
                      className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading
                        ? "Loading..."
                        : isExpanded
                          ? "Hide Details"
                          : "View Details"}
                    </button>

                    {isExpanded && (
                      <div className="mt-4 min-w-56 rounded-lg border border-gray-200 bg-gray-50 p-4 text-left">
                        {isLoading ? (
                          <p className="text-sm text-gray-500">
                            Loading business details...
                          </p>
                        ) : errors[business.placeId] ? (
                          <div>
                            <p className="text-sm text-red-600">
                              {errors[business.placeId]}
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                handleViewDetails(
                                  business.placeId
                                )
                              }
                              className="mt-2 text-xs font-medium text-blue-600 hover:underline"
                            >
                              Try again
                            </button>
                          </div>
                        ) : businessDetails ? (
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="font-medium text-gray-700">
                                Phone
                              </p>

                              <p className="mt-1 text-gray-600">
                                {businessDetails.phone ||
                                  "Not available"}
                              </p>
                            </div>

                            <div>
                              <p className="font-medium text-gray-700">
                                Website
                              </p>

                              {businessDetails.website ? (
                                <a
                                  href={businessDetails.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-1 block break-all text-blue-600 hover:underline"
                                >
                                  Visit Website
                                </a>
                              ) : (
                                <p className="mt-1 text-gray-600">
                                  Not available
                                </p>
                              )}
                            </div>

                            <div>
                              <p className="font-medium text-gray-700">
                                Rating
                              </p>

                              <p className="mt-1 text-gray-600">
                                {businessDetails.rating != null
                                  ? `⭐ ${businessDetails.rating} / 5`
                                  : "Not available"}
                              </p>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 px-6 py-3">
        <p className="text-xs text-gray-500">
          Business information provided by Google Maps.
        </p>
      </div>
    </div>
  );
}