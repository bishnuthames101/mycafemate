"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTenantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    slug: string;
    loginUrl: string;
    credentials: {
      admin: { email: string; password: string };
      kitchen: { email: string; password: string };
      staff: { email: string; password: string };
    };
  } | null>(null);

  const [formData, setFormData] = useState({
    businessName: "",
    slug: "",
    contactEmail: "",
    contactPhone: "",
    trialDays: "14",
    // subscriptionTier removed - all tenants use BASIC (1200 NPR usage-based pricing)
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug from business name
    if (name === "businessName") {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 30);

      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare data with proper types
      const payload = {
        businessName: formData.businessName,
        slug: formData.slug,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone || undefined, // Convert empty string to undefined
        trialDays: parseInt(formData.trialDays, 10), // Convert to number
      };

      const response = await fetch("/api/super-admin/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show detailed validation errors if available
        const errorMessage = data.details
          ? `${data.error}\n${data.details.join('\n')}`
          : data.error || "Failed to create tenant";
        throw new Error(errorMessage);
      }

      setSuccess({
        slug: data.slug,
        loginUrl: data.loginUrl,
        credentials: data.credentials,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Tenant Created Successfully!
            </h2>
            <p className="mt-2 text-gray-600">
              The cafe has been provisioned and is ready to use.
            </p>
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Tenant URL
              </label>
              <a
                href={success.loginUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-lg text-blue-600 hover:text-blue-800 font-mono break-all"
              >
                {success.loginUrl}
              </a>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Login Credentials
              </h3>
              <p className="text-sm text-gray-600">
                Share with cafe owner
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Important:</strong> The cafe owner should change these passwords immediately after first login.
              </p>
            </div>

            <div className="space-y-4">
              {/* Admin Credentials */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Admin Access</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">ADMIN</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="font-mono text-sm text-gray-900">{success.credentials.admin.email}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(success.credentials.admin.email)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      title="Copy email"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Password</p>
                      <p className="font-mono text-sm text-gray-900">{success.credentials.admin.password}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(success.credentials.admin.password)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      title="Copy password"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Kitchen Credentials */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Kitchen Staff Access</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">KITCHEN</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="font-mono text-sm text-gray-900">{success.credentials.kitchen.email}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(success.credentials.kitchen.email)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      title="Copy email"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Password</p>
                      <p className="font-mono text-sm text-gray-900">{success.credentials.kitchen.password}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(success.credentials.kitchen.password)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      title="Copy password"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Staff Credentials */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Staff Access</h4>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">STAFF</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="font-mono text-sm text-gray-900">{success.credentials.staff.email}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(success.credentials.staff.email)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      title="Copy email"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Password</p>
                      <p className="font-mono text-sm text-gray-900">{success.credentials.staff.password}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(success.credentials.staff.password)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      title="Copy password"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Link
              href={`/super-admin/tenants/${success.slug}`}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-center"
            >
              View Tenant Details
            </Link>
            <Link
              href="/super-admin/tenants/new"
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium text-center"
            >
              Create Another
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/super-admin/tenants"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to Tenants
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create New Tenant
        </h1>
        <p className="text-gray-600 mb-8">
          Provision a new cafe with isolated database and trial period
        </p>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error creating tenant:</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Information */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Business Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Cafe ABC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tenant Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  pattern="[a-z0-9-]{3,30}"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  placeholder="cafe-abc"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Lowercase letters, numbers, and hyphens only (3-30 chars)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="contact@cafe.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+977 98..."
                  />
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
              ℹ️ Three users will be automatically created: <strong>admin</strong>, <strong>kitchen</strong>, and <strong>staff</strong> with default passwords.
            </p>
          </div>

          {/* Subscription Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Subscription Details
            </h2>

            <div className="space-y-4">
              {/* Pricing Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Usage-Based Pricing</h3>
                <p className="text-sm text-blue-800 mb-3">
                  <strong className="text-2xl">NPR 1,200/month</strong> base fee + usage overages
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>✓ 500 MB Database Storage</li>
                  <li>✓ 10 GB Bandwidth/month</li>
                  <li>✓ 1,000 Orders/month</li>
                  <li>✓ 3 Staff Accounts (1 Admin, 1 Waiter, 1 Kitchen)</li>
                  <li>✓ All Features Included</li>
                </ul>
                <p className="text-xs text-blue-600 mt-2 italic">
                  Overage charges apply if limits exceeded
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trial Period (days) *
                </label>
                <input
                  type="number"
                  name="trialDays"
                  value={formData.trialDays}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="90"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Provisioning..." : "Create Tenant"}
            </button>
            <Link
              href="/super-admin/tenants"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
