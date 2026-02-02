import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - My-CafeMate",
  description: "Terms of Service for My-CafeMate cafe management system",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="border-b border-amber-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-amber-900 hover:text-amber-700">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-600 mb-8">Last updated: January 5, 2026</p>

        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing and using My-CafeMate, you accept and agree to be bound by the terms and provision
              of this agreement. If you do not agree to these Terms of Service, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
            <p>
              My-CafeMate provides a cloud-based cafe and restaurant management platform that includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Order management system</li>
              <li>Inventory tracking and management</li>
              <li>Staff management and role-based access control</li>
              <li>Sales analytics and reporting</li>
              <li>Kitchen display system</li>
              <li>Multi-location support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
            <p>To use our service, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept all risks of unauthorized access to your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription and Billing</h2>
            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">4.1 Pricing</h3>
            <p>
              Our service is offered on a subscription basis at NPR 1,200 per month (base plan) plus usage-based
              overages. Pricing is subject to change with 30 days notice.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">4.2 Free Trial</h3>
            <p>
              We offer a 14-day free trial with full feature access. No credit card is required for the trial.
              After the trial period, you must subscribe to continue using the service.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">4.3 Payment Terms</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Subscription fees are billed monthly in advance</li>
              <li>Usage-based charges are billed monthly in arrears</li>
              <li>All fees are in Nepali Rupees (NPR)</li>
              <li>Late payments may result in service suspension</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the service for any illegal purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit any viruses or malicious code</li>
              <li>Attempt to gain unauthorized access to the service</li>
              <li>Interfere with or disrupt the service</li>
              <li>Use the service to send spam or unsolicited messages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Ownership and Usage</h2>
            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">6.1 Your Data</h3>
            <p>
              You retain all rights to your business data entered into the system. We do not claim ownership
              of your data.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">6.2 Data Security</h3>
            <p>
              We implement industry-standard security measures to protect your data, including encryption,
              backups, and access controls.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">6.3 Data Export</h3>
            <p>
              You can export your data at any time during your subscription. Upon cancellation, you have
              30 days to export your data before it is deleted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Service Availability</h2>
            <p>
              We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. We may perform
              scheduled maintenance with advance notice. We are not liable for any downtime or service
              interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cancellation and Termination</h2>
            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">8.1 Cancellation by You</h3>
            <p>
              You may cancel your subscription at any time. Cancellation takes effect at the end of the
              current billing period. No refunds for partial months.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">8.2 Termination by Us</h3>
            <p>
              We reserve the right to suspend or terminate your account for violation of these terms,
              non-payment, or fraudulent activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Intellectual Property</h2>
            <p>
              The service, including all content, features, and functionality, is owned by My-CafeMate and
              protected by copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, My-CafeMate shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including loss of profits, data,
              or business interruption.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Support</h2>
            <p>
              We provide email support with 48-hour response time for all subscribers. Priority support
              with 24-hour response time is available for an additional NPR 500/month.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify you of material
              changes via email. Continued use of the service after changes constitutes acceptance of
              new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Nepal,
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
            <p>For questions about these Terms of Service, please contact us:</p>
            <ul className="list-none space-y-2 mt-4">
              <li><strong>Email:</strong> info@mycafemate.com</li>
              <li><strong>Phone:</strong> +977 980-0000000</li>
              <li><strong>Address:</strong> Kathmandu, Nepal</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/"
            className="inline-block bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
