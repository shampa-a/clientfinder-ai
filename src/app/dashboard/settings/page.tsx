"use client";

import { useState, type FormEvent } from "react";
import {
  User,
  Mail,
  Building2,
  Bell,
  Lock,
  Save,
  Settings,
  ShieldCheck,
} from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // UI demonstration only.
    // Database integration will be added later.
    setMessage("Settings saved successfully!");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-3">
            <Settings className="text-blue-600" size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Settings
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your account and preferences.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Settings */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-200 p-6">
            <User className="text-blue-600" size={21} />

            <div>
              <h2 className="font-semibold text-gray-900">
                Profile Information
              </h2>

              <p className="text-sm text-gray-500">
                Update your personal information.
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-3.5 text-gray-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Company */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Company / Business Name
              </label>

              <div className="relative">
                <Building2
                  size={18}
                  className="absolute left-3 top-3.5 text-gray-400"
                />

                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Enter your company name"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-200 p-6">
            <Bell className="text-blue-600" size={21} />

            <div>
              <h2 className="font-semibold text-gray-900">
                Notification Preferences
              </h2>

              <p className="text-sm text-gray-500">
                Control how you receive notifications.
              </p>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Account Notifications
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Receive important account and activity updates.
                </p>
              </div>

              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="h-5 w-5 accent-blue-600"
              />
            </label>

            <div className="border-t border-gray-100" />

            <label className="flex cursor-pointer items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Product Updates & Offers
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Receive news, product updates and special offers.
                </p>
              </div>

              <input
                type="checkbox"
                checked={marketingEmails}
                onChange={(e) =>
                  setMarketingEmails(e.target.checked)
                }
                className="h-5 w-5 accent-blue-600"
              />
            </label>
          </div>
        </section>

        {/* Security Settings */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-200 p-6">
            <Lock className="text-blue-600" size={21} />

            <div>
              <h2 className="font-semibold text-gray-900">
                Security
              </h2>

              <p className="text-sm text-gray-500">
                Manage your account security.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={25}
                className="text-green-600"
              />

              <div>
                <p className="text-sm font-medium text-gray-800">
                  Password & Authentication
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Your account is protected by Better Auth.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-400"
            >
              Change Password
            </button>
          </div>
        </section>

        {/* Success Message */}
        {message && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}