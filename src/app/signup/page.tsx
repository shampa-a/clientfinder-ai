"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  Loader2,
} from "lucide-react";

type UserRole = "freelancer" | "agency" | "business";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("freelancer");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
       
      });

      if (error) {
        setError(error.message || "Registration failed.");
        return;
      }

      if (data) {
        setSuccess("Account created successfully!");

        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      }
    } catch (err) {
      console.error("Signup error:", err);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Logo */}

        <div className="text-center mb-8">

          <Link
            href="/"
            className="text-3xl font-bold text-blue-600"
          >
            ClientFinder AI
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mt-6">
            Create Your Account
          </h1>

          <p className="text-gray-500 mt-2">
            Start finding potential clients today.
          </p>

        </div>

        {/* Signup Form */}

        <form onSubmit={handleSignup} className="space-y-5">

          {/* Name */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>

            <div className="relative">

              <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

          {/* Email */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <div className="relative">

              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

          {/* Password */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">

              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* Account Type */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>

            <div className="relative">

              <Briefcase className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as UserRole)
                }
                className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >

                <option value="freelancer">
                  Freelancer
                </option>

                <option value="agency">
                  Agency
                </option>

                <option value="business">
                  Business
                </option>

              </select>

            </div>

          </div>

          {/* Error Message */}

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}

          {success && (
            <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >

            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}

          </button>

        </form>

        {/* Login Link */}

        <p className="text-center text-sm text-gray-500 mt-6">

          Already have an account?{" "}

          <Link
            href="/signin"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign In
          </Link>

        </p>

      </div>

    </div>
  );
}