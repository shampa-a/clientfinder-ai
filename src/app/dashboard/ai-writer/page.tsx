"use client";

import { useState } from "react";
import {
  Sparkles,
  Mail,
  MessageSquare,
  Copy,
  RefreshCw,
  WandSparkles,
  Check,
  Loader2,
  Send,
} from "lucide-react";

type WritingType = "cold-email" | "follow-up" | "linkedin";

export default function AIWriterPage() {
  const [writingType, setWritingType] =
    useState<WritingType>("cold-email");

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [service, setService] = useState("");
  const [tone, setTone] = useState("Professional");
  const [details, setDetails] = useState("");

  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!businessName.trim() || !service.trim()) {
      alert("Please enter business name and your service.");
      return;
    }

    setLoading(true);
    setGeneratedText("");

    try {
      const response = await fetch("/api/ai-writer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          writingType,
          businessName,
          businessType,
          service,
          tone,
          details,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content.");
      }

      setGeneratedText(data.content);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedText) return;

    await navigator.clipboard.writeText(generatedText);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  const writingOptions = [
    {
      id: "cold-email",
      title: "Cold Email",
      description: "Reach potential clients",
      icon: Mail,
    },
    {
      id: "follow-up",
      title: "Follow-up Email",
      description: "Follow up with prospects",
      icon: MessageSquare,
    },
    {
  id: "linkedin",
  title: "LinkedIn Message",
  description: "Connect with businesses",
  icon: Send,
},
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
            <Sparkles size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              AI Writer
            </h1>

            <p className="text-sm text-gray-500">
              Create personalized messages to convert prospects into clients.
            </p>
          </div>
        </div>
      </div>

      {/* Writing Type */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-gray-800">
          Choose Content Type
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {writingOptions.map((option) => {
            const Icon = option.icon;
            const active = writingType === option.id;

            return (
              <button
                key={option.id}
                onClick={() => setWritingType(option.id)}
                className={`rounded-xl border p-5 text-left transition ${
                  active
                    ? "border-purple-500 bg-purple-50 ring-2 ring-purple-100"
                    : "border-gray-200 bg-white hover:border-purple-300"
                }`}
              >
                <div
                  className={`mb-3 inline-flex rounded-lg p-3 ${
                    active
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Icon size={22} />
                </div>

                <h3 className="font-semibold text-gray-900">
                  {option.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-2">
            <WandSparkles className="text-purple-600" size={20} />

            <h2 className="font-semibold text-gray-900">
              Message Details
            </h2>
          </div>

          <div className="space-y-4">
            {/* Business Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Business Name *
              </label>

              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. ABC Digital Agency"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Business Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Business Type
              </label>

              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="e.g. Restaurant, Agency, Hotel"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Service */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Your Service *
              </label>

              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="e.g. Website Design, SEO, Marketing"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Tone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Writing Tone
              </label>

              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500"
              >
                <option value="Professional">Professional</option>
                <option value="Friendly">Friendly</option>
                <option value="Persuasive">Persuasive</option>
                <option value="Casual">Casual</option>
                <option value="Formal">Formal</option>
              </select>
            </div>

            {/* Additional Details */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Additional Details
              </label>

              <textarea
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe your offer or mention any specific business problem you want to address..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={19} />
                  Generate with AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Content */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-purple-600" />

              <h2 className="font-semibold text-gray-900">
                Generated Content
              </h2>
            </div>

            {generatedText && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>

          {generatedText ? (
            <div className="min-h-[400px] whitespace-pre-wrap rounded-lg bg-gray-50 p-5 text-sm leading-7 text-gray-700">
              {generatedText}
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 px-6 text-center">
              <div className="mb-4 rounded-full bg-purple-100 p-5">
                <Sparkles size={30} className="text-purple-600" />
              </div>

              <h3 className="font-semibold text-gray-800">
                Your content will appear here
              </h3>

              <p className="mt-2 max-w-xs text-sm text-gray-500">
                Fill in the business details and click Generate with AI.
              </p>
            </div>
          )}

          {generatedText && (
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-purple-200 px-4 py-3 text-sm font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-60"
            >
              <RefreshCw size={16} />
              Regenerate Content
            </button>
          )}
        </div>
      </div>

      {/* Information */}
      <div className="rounded-xl border border-purple-100 bg-purple-50 p-5">
        <div className="flex gap-3">
          <Sparkles className="shrink-0 text-purple-600" size={22} />

          <div>
            <h3 className="font-semibold text-purple-900">
              AI-Powered Client Outreach
            </h3>

            <p className="mt-1 text-sm leading-6 text-purple-800">
              Generate personalized outreach messages for your potential
              clients. Always review the generated content before sending
              it to a prospect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}