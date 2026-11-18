"use client";

import { useState } from "react";
import {
  Mail,
  MessageSquare,
  Copy,
  RefreshCw,
  Check,
  Send,
  FileText,
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
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generateMessage = () => {
    if (!businessName.trim() || !service.trim()) {
      setError("Please enter Business Name and Your Service.");
      return;
    }

    setError("");

    const business = businessName.trim();
    const businessCategory = businessType.trim();
    const offeredService = service.trim();
    const additionalDetails = details.trim();

    const greeting =
      tone === "Friendly" || tone === "Casual"
        ? "Hi"
        : "Hello";

    const closing =
      tone === "Formal"
        ? "Kind regards,"
        : tone === "Friendly" || tone === "Casual"
          ? "Best,"
          : "Best regards,";

    let message = "";

    if (writingType === "cold-email") {
      message = `Subject: Helping ${business} Improve Its Online Presence

${greeting} ${business} Team,

I hope you are doing well.

My name is [Your Name], and I provide ${offeredService} services.

I came across ${business}${
        businessCategory ? `, a ${businessCategory.toLowerCase()}` : ""
      }, and wanted to reach out to introduce my services.

I believe I could help your business improve its online presence, attract more potential customers, and create a better experience for your audience.

${
  additionalDetails
    ? additionalDetails + "\n\n"
    : ""
}Would you be available for a short conversation to discuss how I could help?

Thank you for your time.

${closing}
[Your Name]
[Your Portfolio / Website]`;
    }

    if (writingType === "follow-up") {
      message = `Subject: Following Up on My Previous Message

${greeting} ${business} Team,

I hope everything is going well.

I wanted to follow up on my previous message regarding my ${offeredService} services.

I understand you may be busy, so I just wanted to check whether you had a chance to review my proposal.

I would be happy to discuss how my services could support ${business} and help achieve your business goals.

${
  additionalDetails
    ? additionalDetails + "\n\n"
    : ""
}Please let me know if you would be interested in discussing this further.

Thank you for your time.

${closing}
[Your Name]`;
    }

    if (writingType === "linkedin") {
      message = `Hello ${business} Team,

I came across ${business} and wanted to connect.

I provide ${offeredService} services and help businesses improve their online presence and reach more customers.

${
  additionalDetails
    ? additionalDetails + "\n\n"
    : ""
}I would love to connect and explore whether there might be an opportunity to work together.

Looking forward to connecting!

Best,
[Your Name]`;
    }

    setGeneratedText(message);
  };

  const handleCopy = async () => {
    if (!generatedText) return;

    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Unable to copy. Please copy the message manually.");
    }
  };

  const handleReset = () => {
    setGeneratedText("");
    setCopied(false);
    setError("");
  };

  const writingOptions = [
    {
      id: "cold-email",
      title: "Cold Email",
      description: "Contact potential clients",
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
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
          <FileText size={25} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Email & Message Templates
          </h1>

          <p className="text-sm text-gray-500">
            Create professional client outreach messages without paid APIs.
          </p>
        </div>
      </div>

      {/* Writing Type */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-gray-800">
          Choose Message Type
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {writingOptions.map((option) => {
            const Icon = option.icon;
            const active = writingType === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setWritingType(option.id);
                  handleReset();
                }}
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
          <div className="mb-5">
            <h2 className="font-semibold text-gray-900">
              Message Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter details to personalize your message.
            </p>
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
                placeholder="Describe your offer or mention a specific business problem..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Generate Button */}
            <button
              type="button"
              onClick={generateMessage}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              <FileText size={19} />
              Generate Message
            </button>
          </div>
        </div>

        {/* Generated Content */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                Message Preview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review and copy your message.
              </p>
            </div>

            {generatedText && (
              <button
                type="button"
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
                <FileText size={30} className="text-purple-600" />
              </div>

              <h3 className="font-semibold text-gray-800">
                Your message will appear here
              </h3>

              <p className="mt-2 max-w-xs text-sm text-gray-500">
                Fill in the business details and click Generate Message.
              </p>
            </div>
          )}

          {generatedText && (
            <button
              type="button"
              onClick={generateMessage}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-purple-200 px-4 py-3 text-sm font-medium text-purple-700 hover:bg-purple-50"
            >
              <RefreshCw size={16} />
              Regenerate Message
            </button>
          )}
        </div>
      </div>

      {/* Information */}
      <div className="rounded-xl border border-purple-100 bg-purple-50 p-5">
        <div className="flex gap-3">
          <FileText className="shrink-0 text-purple-600" size={22} />

          <div>
            <h3 className="font-semibold text-purple-900">
              Free Client Outreach Templates
            </h3>

            <p className="mt-1 text-sm leading-6 text-purple-800">
              Generate cold emails, follow-up emails, and LinkedIn
              messages using built-in templates. No OpenAI API key,
              external API, or additional API cost is required.
              Review each message before sending it to a prospect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}