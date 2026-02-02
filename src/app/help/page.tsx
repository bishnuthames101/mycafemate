import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center - My-CafeMate",
  description: "Help and support for My-CafeMate cafe management system",
};

export default function HelpCenterPage() {
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
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600">Find answers to common questions and get support</p>
        </div>

        {/* Contact Support Banner */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-2xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
              <p className="mb-6">Our support team is here to assist you with any questions or issues.</p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="mr-3">📧</span>
                  <div>
                    <p className="font-semibold">Email Support</p>
                    <a
                      href="mailto:info@mycafemate.com?subject=Support%20Request%20-%20My-CafeMate&body=Hello%20My-CafeMate%20Support%20Team%2C%0D%0A%0D%0AI%20need%20assistance%20with%3A%0D%0A%0D%0A%5BPlease%20describe%20your%20question%20or%20issue%20here%5D%0D%0A%0D%0ABusiness%20Name%3A%20%0D%0AContact%20Person%3A%20%0D%0APhone%3A%20%0D%0AEmail%3A%20%0D%0A%0D%0AThank%20you!"
                      className="hover:underline"
                    >
                      info@mycafemate.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-3">📞</span>
                  <div>
                    <p className="font-semibold">Phone Support</p>
                    <a href="tel:+9779800000000" className="hover:underline">+977 980-0000000</a>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-3">⏰</span>
                  <div>
                    <p className="font-semibold">Business Hours</p>
                    <p>Sunday - Friday: 9 AM - 6 PM NST</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3">Response Time</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-amber-200 mr-2">✓</span>
                  <span><strong>Standard Support:</strong> 48-hour response</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-200 mr-2">✓</span>
                  <span><strong>Priority Support:</strong> 24-hour response (NPR 500/mo)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-200 mr-2">✓</span>
                  <span><strong>Setup Assistance:</strong> Included with free trial</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>

          {/* Getting Started */}
          <section className="bg-white rounded-xl shadow-lg p-8 border border-amber-100">
            <h3 className="text-2xl font-bold text-amber-900 mb-6 flex items-center">
              <span className="mr-3">🚀</span>
              Getting Started
            </h3>
            <div className="space-y-6">
              <FAQItem
                question="How do I sign up for My-CafeMate?"
                answer="Contact us via email (info@mycafemate.com) or phone (+977 980-0000000) to request a free trial. We'll set up your account and provide you with login credentials for your custom subdomain."
              />
              <FAQItem
                question="What is included in the free trial?"
                answer="The 14-day free trial includes full access to all features: order management, inventory tracking, staff management, kitchen display, and analytics. No credit card required."
              />
              <FAQItem
                question="How long does setup take?"
                answer="Initial setup takes just 5 minutes. We provide setup assistance to help you add your menu items, tables, and staff members."
              />
            </div>
          </section>

          {/* Pricing & Billing */}
          <section className="bg-white rounded-xl shadow-lg p-8 border border-amber-100">
            <h3 className="text-2xl font-bold text-amber-900 mb-6 flex items-center">
              <span className="mr-3">💰</span>
              Pricing & Billing
            </h3>
            <div className="space-y-6">
              <FAQItem
                question="How much does My-CafeMate cost?"
                answer="The base plan is NPR 1,200/month and includes 100 MB storage, 10 GB bandwidth, 1,000 orders/month, and 3 staff accounts. Usage beyond these limits is charged at transparent overage rates."
              />
              <FAQItem
                question="What happens if I exceed my limits?"
                answer="You'll be charged only for what you use: NPR 5/GB for extra storage, NPR 10/GB for extra bandwidth, NPR 0.50 per extra order, and NPR 100/month per extra staff account."
              />
              <FAQItem
                question="Can I cancel anytime?"
                answer="Yes, you can cancel your subscription at any time. Cancellation takes effect at the end of your current billing period. You'll have 30 days to export your data."
              />
            </div>
          </section>

          {/* Features */}
          <section className="bg-white rounded-xl shadow-lg p-8 border border-amber-100">
            <h3 className="text-2xl font-bold text-amber-900 mb-6 flex items-center">
              <span className="mr-3">⚡</span>
              Features & Usage
            </h3>
            <div className="space-y-6">
              <FAQItem
                question="Can I manage multiple locations?"
                answer="Yes! My-CafeMate supports multi-location management. You can track inventory, sales, and staff across different branches from a single dashboard."
              />
              <FAQItem
                question="How does the kitchen display system work?"
                answer="Kitchen staff can log in to see real-time order updates. Orders automatically flow from the staff interface to the kitchen display, showing what needs to be prepared."
              />
              <FAQItem
                question="Can I export my data?"
                answer="Yes, you can export your sales reports, inventory data, and other business information at any time through the admin dashboard."
              />
              <FAQItem
                question="Is my data secure?"
                answer="Absolutely. We use bank-level encryption, automatic daily backups, and a multi-tenant architecture with strict data isolation between accounts."
              />
            </div>
          </section>

          {/* Technical Support */}
          <section className="bg-white rounded-xl shadow-lg p-8 border border-amber-100">
            <h3 className="text-2xl font-bold text-amber-900 mb-6 flex items-center">
              <span className="mr-3">🔧</span>
              Technical Support
            </h3>
            <div className="space-y-6">
              <FAQItem
                question="What devices can I use?"
                answer="My-CafeMate is web-based and works on any device with a modern browser: computers, tablets, and smartphones. No app installation required."
              />
              <FAQItem
                question="Do I need technical knowledge?"
                answer="No technical knowledge is required. Our interface is designed to be simple and intuitive. We also provide setup assistance and ongoing support."
              />
              <FAQItem
                question="What if I encounter a problem?"
                answer="Contact our support team via email or phone. We respond within 48 hours for standard support, or 24 hours for priority support subscribers."
              />
            </div>
          </section>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-amber-50 rounded-2xl p-8 text-center border-2 border-amber-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-700 mb-6">Our team is ready to help you get started with My-CafeMate</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@mycafemate.com?subject=Support%20Request%20-%20My-CafeMate&body=Hello%20My-CafeMate%20Support%20Team%2C%0D%0A%0D%0AI%20need%20assistance%20with%3A%0D%0A%0D%0A%5BPlease%20describe%20your%20question%20or%20issue%20here%5D%0D%0A%0D%0ABusiness%20Name%3A%20%0D%0AContact%20Person%3A%20%0D%0APhone%3A%20%0D%0AEmail%3A%20%0D%0A%0D%0AThank%20you!"
              className="bg-amber-700 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition font-semibold"
            >
              Email Us
            </a>
            <Link
              href="/"
              className="border-2 border-amber-700 text-amber-800 px-8 py-3 rounded-lg hover:bg-amber-50 transition font-semibold"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-l-4 border-amber-600 pl-4">
      <h4 className="font-bold text-gray-900 mb-2">{question}</h4>
      <p className="text-gray-700">{answer}</p>
    </div>
  );
}
