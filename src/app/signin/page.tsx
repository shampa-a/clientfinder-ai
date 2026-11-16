"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react";

export default function SignInPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        rememberMe: true,
      });

      if (error) {
        setError(
          error.message || "Invalid email or password."
        );
        return;
      }

      if (data) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error("Signin error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-md">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="bg-blue-600 p-2.5 rounded-xl">
            <Search className="w-6 h-6 text-white" />
          </div>

          <span className="text-2xl font-bold text-white">
            ClientFinder
            <span className="text-blue-500"> AI</span>
          </span>
        </Link>

        {/* Sign In Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

          <div className="text-center mb-8">

            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full text-sm mb-4">
              <Sparkles size={15} />
              Welcome Back
            </div>

            <h1 className="text-3xl font-bold text-white mb-3">
              Sign in to your account
            </h1>

            <p className="text-slate-400 text-sm">
              Find new clients and grow your business with AI.
            </p>

          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                defaultChecked
                className="w-4 h-4 accent-blue-600"
              />

              <label
                htmlFor="remember"
                className="text-sm text-slate-400"
              >
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition duration-200"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>

          {/* Sign Up */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
             Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-400 font-semibold hover:text-blue-300"
              >
                Create an account
              </Link>
            </p>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-8">
          © 2026 ClientFinder AI. All rights reserved.
        </p>

      </div>
    </div>
  );
}