
"use client";

import { useState } from "react";

type Business = {
  placeId: string;
  name: string;
  address?: string;
};

type BusinessDetails = {
  phone?: string | null;
  website?: string | null;
  rating?: number | null;
};

type BusinessResultsTableProps = {
  businesses: Business[];
};

export default function BusinessResultsTable({
  businesses,
}: BusinessResultsTableProps) {
  const [details, setDetails] = useState<Record<string, BusinessDetails>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadDetails(placeId: string) {
    setLoadingId(placeId);
    setError("");

    try {
      const response = await fetch(
        `/api/businesses/${encodeURIComponent(placeId)}`,
        { cache: "no-store" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Could not load business details."
        );
      }

      setDetails((previous) => ({
        ...previous,
        [placeId]: result.business,
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoadingId(null);
    }
  }

  if (businesses.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        <h3 className="font-semibold text-slate-800">
          No businesses found
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Try another search.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      {error && (
        <p className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-5 py-4">Business Name</th>
              <th className="px-5 py-4">Address</th>
              <th className="px-5 py-4">Place ID</th>
              <th className="px-5 py-4">Details</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {businesses.map((business, index) => {
              const businessDetails = details[business.placeId];
              const isLoading = loadingId === business.placeId;

              return (
                <tr
                  key={`${business.placeId || business.name}-${index}`}
                  className="align-top hover:bg-slate-50"
                >
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {business.name || "Name not available"}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {business.address || "Not available"}
                  </td>

                  <td className="max-w-[180px] break-all px-5 py-4 text-xs text-slate-500">
                    {business.placeId || "Not available"}
                  </td>

                  <td className="px-5 py-4">
                    {!businessDetails ? (
                      <button
                        type="button"
                        onClick={() => loadDetails(business.placeId)}
                        disabled={isLoading || !business.placeId}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isLoading ? "Loading..." : "View Details"}
                      </button>
                    ) : (
                      <div className="min-w-[190px] space-y-2 text-xs text-slate-600">
                        <p>
                          <strong>Phone:</strong>{" "}
                          {businessDetails.phone || "Not available"}
                        </p>

                        <p>
                          <strong>Website:</strong>{" "}
                          {businessDetails.website ? (
                            <a
                              href={businessDetails.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Visit website
                            </a>
                          ) : (
                            "Not available"
                          )}
                        </p>

                        <p>
                          <strong>Rating:</strong>{" "}
                          {typeof businessDetails.rating === "number"
                            ? `★ ${businessDetails.rating.toFixed(1)}`
                            : "Not available"}
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t bg-slate-50 px-5 py-3">
        <span
          translate="no"
          className="text-xs font-medium text-slate-600"
        >
          Google Maps
        </span>
      </div>
    </div>
  );
}
