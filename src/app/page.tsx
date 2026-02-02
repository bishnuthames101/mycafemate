import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const hostWithoutPort = host.split(":")[0];

  // Check if accessing from a subdomain
  const isSubdomain = hostWithoutPort.includes(".");
  const isLocalhost = hostWithoutPort === "localhost" || hostWithoutPort.startsWith("localhost:");

  // If accessing admin subdomain, redirect to super admin
  if (hostWithoutPort.startsWith("admin.")) {
    redirect("/super-admin");
  }

  // If accessing tenant subdomain, redirect to their login
  if (isSubdomain && !isLocalhost) {
    redirect("/login");
  }

  // Structured data for SEO and AI/LLM discovery
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "My-CafeMate",
        "applicationCategory": "BusinessApplication",
        "applicationSubCategory": "Restaurant Management Software",
        "offers": {
          "@type": "Offer",
          "price": "1200",
          "priceCurrency": "NPR",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "1200",
            "priceCurrency": "NPR",
            "billingDuration": "P1M",
            "name": "Monthly subscription"
          }
        },
        "description": "Complete cafe management system for Nepal. Order management, inventory tracking, staff management, and analytics. Built specifically for Nepali cafes and restaurants.",
        "operatingSystem": "Web-based",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "50"
        },
        "featureList": "Order Management, Inventory Tracking, Staff Management, Kitchen Display System, Sales Analytics, Multi-location Support, Cloud-based Access",
        "releaseNotes": "Latest features: Usage-based pricing, Real-time analytics, Tenant management",
        "countryOfOrigin": {
          "@type": "Country",
          "name": "Nepal"
        }
      },
      {
        "@type": "Organization",
        "name": "My-CafeMate",
        "url": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "logo": "/logo.png",
        "description": "Leading cafe and restaurant management software provider in Nepal",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+977-980-0000000",
          "contactType": "Customer Service",
          "areaServed": "NP",
          "availableLanguage": "en"
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Kathmandu",
          "addressCountry": "NP"
        },
        "sameAs": []
      },
      {
        "@type": "WebSite",
        "name": "My-CafeMate",
        "url": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "description": "Complete cafe management solution for Nepal",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the best cafe management software in Nepal?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "My-CafeMate is a comprehensive cafe management system built specifically for Nepali cafes. It includes order management, inventory tracking, staff management, and analytics for just NPR 1,200/month with a 14-day free trial."
            }
          },
          {
            "@type": "Question",
            "name": "How much does My-CafeMate cost?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "My-CafeMate uses usage-based pricing starting at NPR 1,200/month. The base plan includes 100 MB database storage, 10 GB bandwidth, 1,000 orders per month, and 3 staff accounts (1 Admin, 1 Waiter, 1 Kitchen). You only pay for what you use beyond these limits."
            }
          },
          {
            "@type": "Question",
            "name": "What features does My-CafeMate include?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "My-CafeMate includes smart order management, intelligent inventory tracking with low stock alerts, revenue analytics with trend analysis, multi-location support, role-based access control for Admin/Staff/Kitchen, and cloud-based access with automatic backups."
            }
          },
          {
            "@type": "Question",
            "name": "Is there a free trial for My-CafeMate?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, My-CafeMate offers a 14-day free trial with full feature access. No credit card required. You can start managing your cafe in just 5 minutes with setup assistance included."
            }
          },
          {
            "@type": "Question",
            "name": "Does My-CafeMate work for small cafes in Nepal?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! My-CafeMate is designed for cafes of all sizes in Nepal. The base plan at NPR 1,200/month is perfect for small cafes, with the ability to scale as you grow. Most small cafes stay within the base limits."
            }
          }
        ]
      }
    ]
  };

  // For root domain (localhost:3000 or mycafemate.com), show landing page
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Header */}
      <header className="border-b border-amber-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="My-CafeMate Logo"
              width={32}
              height={32}
              className="rounded-lg shadow-md md:w-10 md:h-10"
            />
            <span className="text-xl md:text-2xl font-bold text-amber-900">My-CafeMate</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-amber-700 transition font-medium">Features</a>
            <a href="#pricing" className="text-gray-700 hover:text-amber-700 transition font-medium">Pricing</a>
            <a href="#contact" className="text-gray-700 hover:text-amber-700 transition font-medium">Contact</a>
          </nav>
          <div className="flex items-center">
            <a
              href="#contact"
              className="bg-gradient-to-r from-amber-700 to-amber-800 text-white px-4 py-2 md:px-6 md:py-2 rounded-lg hover:from-amber-800 hover:to-amber-900 transition shadow-md text-sm md:text-base"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 text-center" aria-label="Hero section">
        <div className="inline-block mb-4 px-4 py-2 bg-amber-100 text-amber-900 rounded-full text-xs md:text-sm font-semibold">
          Complete Cafe Management Solution for Nepal
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight px-2">
          Manage Your Cafe
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-900">
            Like a Pro
          </span>
        </h1>
        <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
          From orders to inventory, staff management to analytics - everything you need to run a successful cafe,
          all in one powerful platform built specifically for Nepali cafes.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4">
          <a
            href="mailto:info@mymycafemate.com?subject=Free%20Trial%20Request%20for%20My-CafeMate&body=Hello%2C%0D%0A%0D%0AI%20would%20like%20to%20request%20a%2014-day%20free%20trial%20for%20My-CafeMate.%0D%0A%0D%0ABusiness%20Name%3A%20%0D%0AContact%20Person%3A%20%0D%0APhone%3A%20%0D%0AEmail%3A%20%0D%0ALocation%3A%20%0D%0A%0D%0AThank%20you!"
            className="bg-gradient-to-r from-amber-700 to-amber-800 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:from-amber-800 hover:to-amber-900 transition shadow-lg"
          >
            Start Free Trial
          </a>
          <a
            href="#features"
            className="border-2 border-amber-700 text-amber-800 px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-amber-50 transition"
          >
            See Features
          </a>
        </div>
        <p className="text-xs md:text-sm text-gray-500 mt-4 px-4">
          14-day free trial • No credit card required • Setup in 5 minutes
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-12 md:py-20 border-y border-amber-100" aria-label="Features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Everything Your Cafe Needs</h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto px-4">
              Powerful features designed specifically for cafes in Nepal
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon="📱"
              title="Smart Order Management"
              description="Take and track orders effortlessly. Real-time order status from kitchen to table. Support for dine-in, takeaway, and table reservations."
            />
            <FeatureCard
              icon="📊"
              title="Intelligent Inventory"
              description="Track stock levels automatically. Recipe-based ingredient consumption. Low stock alerts and supplier management."
            />
            <FeatureCard
              icon="💰"
              title="Revenue Analytics"
              description="Daily sales reports with trend analysis. Top-selling products tracking. Category-wise revenue breakdown and profit margins."
            />
            <FeatureCard
              icon="👥"
              title="Multi-Location Support"
              description="Manage multiple branches from one dashboard. Location-wise inventory and sales reports. Perfect for growing cafe chains."
            />
            <FeatureCard
              icon="🔐"
              title="Role-Based Access Control"
              description="Separate access for Admin, Staff, and Kitchen. Secure user management with permissions. Activity logs for accountability."
            />
            <FeatureCard
              icon="☁️"
              title="Cloud-Based & Secure"
              description="Access from anywhere, anytime. Automatic daily backups. Bank-level encryption for your data security."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 md:py-20 bg-gradient-to-b from-amber-50 to-white" aria-label="Pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Simple, Usage-Based Pricing</h2>
            <p className="text-gray-600 text-base md:text-lg px-4">
              Pay only for what you use. Start low, scale as you grow.
            </p>
          </div>

          {/* Main Pricing Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-amber-600 p-6 md:p-8 lg:p-12">
              <div className="text-center mb-6 md:mb-8">
                <div className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs md:text-sm font-bold px-4 md:px-6 py-2 rounded-full shadow-lg mb-3 md:mb-4">
                  ALL FEATURES INCLUDED
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Base Plan</h3>
                <div className="mb-3 md:mb-4">
                  <span className="text-4xl md:text-5xl font-bold text-amber-900">NPR 1,200</span>
                  <span className="text-gray-600 text-lg md:text-xl">/month</span>
                </div>
                <p className="text-sm md:text-base text-gray-600 px-4">+ usage-based overages if you exceed base limits</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                {/* What's Included */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 md:mb-4 text-base md:text-lg">Base Plan Includes:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start text-sm">
                      <span className="text-amber-600 mr-3 mt-0.5 flex-shrink-0 font-bold">✓</span>
                      <span className="text-gray-700"><strong>100 MB</strong> Database Storage</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <span className="text-amber-600 mr-3 mt-0.5 flex-shrink-0 font-bold">✓</span>
                      <span className="text-gray-700"><strong>10 GB</strong> Bandwidth/month</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <span className="text-amber-600 mr-3 mt-0.5 flex-shrink-0 font-bold">✓</span>
                      <span className="text-gray-700"><strong>1,000</strong> Orders/month</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <span className="text-amber-600 mr-3 mt-0.5 flex-shrink-0 font-bold">✓</span>
                      <span className="text-gray-700"><strong>3</strong> Staff Accounts (1 Admin, 1 Waiter, 1 Kitchen)</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <span className="text-amber-600 mr-3 mt-0.5 flex-shrink-0 font-bold">✓</span>
                      <span className="text-gray-700">Unlimited Menu Items & Tables</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <span className="text-amber-600 mr-3 mt-0.5 flex-shrink-0 font-bold">✓</span>
                      <span className="text-gray-700">All Features (Orders, Inventory, Reports)</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <span className="text-amber-600 mr-3 mt-0.5 flex-shrink-0 font-bold">✓</span>
                      <span className="text-gray-700">Email Support (48hr response)</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <span className="text-amber-600 mr-3 mt-0.5 flex-shrink-0 font-bold">✓</span>
                      <span className="text-gray-700">Usage Dashboard & Alerts</span>
                    </li>
                  </ul>
                </div>

                {/* Overage Pricing */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 md:mb-4 text-base md:text-lg">Overage Pricing:</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Extra Storage</span>
                      <span className="font-semibold text-gray-900">NPR 5/GB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Extra Bandwidth</span>
                      <span className="font-semibold text-gray-900">NPR 10/GB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Extra Orders</span>
                      <span className="font-semibold text-gray-900">NPR 0.50/order</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Extra Staff</span>
                      <span className="font-semibold text-gray-900">NPR 100/user</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3 mt-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Priority Support</span>
                        <span className="font-semibold text-gray-900">+NPR 500/mo</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">
                    Most cafes stay within base limits. Growing cafes pay a bit more - fair and transparent.
                  </p>
                </div>
              </div>

              <a
                href="mailto:info@mymycafemate.com?subject=Free%20Trial%20Request%20for%20My-CafeMate&body=Hello%2C%0D%0A%0D%0AI%20would%20like%20to%20request%20a%2014-day%20free%20trial%20for%20My-CafeMate.%0D%0A%0D%0ABusiness%20Name%3A%20%0D%0AContact%20Person%3A%20%0D%0APhone%3A%20%0D%0AEmail%3A%20%0D%0ALocation%3A%20%0D%0A%0D%0AThank%20you!"
                className="block text-center py-4 rounded-lg font-semibold transition bg-gradient-to-r from-amber-700 to-amber-800 text-white hover:from-amber-800 hover:to-amber-900 shadow-md"
              >
                Start Free Trial
              </a>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              14-day free trial • Cancel anytime • No hidden fees
            </p>
            <p className="text-sm text-gray-500">
              Real-time usage dashboard shows exactly what you're using. No surprises.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-amber-800 to-amber-900 text-white py-10 md:py-16" aria-label="Statistics">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <StatCard number="500+" label="Orders Processed Daily" />
            <StatCard number="50+" label="Cafes Trust Us" />
            <StatCard number="99.9%" label="Uptime Guarantee" />
            <StatCard number="24/7" label="Support Available" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-20 bg-white" aria-label="Contact information">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                Ready to Transform Your Cafe?
              </h2>
              <p className="text-base md:text-xl text-gray-600 px-4">
                Join cafes across Nepal already using My-CafeMate to streamline their operations
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Contact Info */}
              <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-xl border border-amber-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  <ContactItem
                    icon="📧"
                    label="Email"
                    value="info@mymycafemate.com"
                    link="mailto:info@mymycafemate.com"
                  />
                  <ContactItem
                    icon="📞"
                    label="Phone"
                    value="+977 980-0000000"
                    link="tel:+9779800000000"
                  />
                  <ContactItem
                    icon="📍"
                    label="Location"
                    value="Kathmandu, Nepal"
                  />
                  <ContactItem
                    icon="⏰"
                    label="Business Hours"
                    value="Sun - Fri: 9 AM - 6 PM"
                  />
                </div>
              </div>

              {/* CTA Box */}
              <div className="bg-gradient-to-br from-amber-700 to-amber-900 p-8 rounded-xl text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Start Your Free Trial</h3>
                <p className="mb-6 opacity-90">
                  No credit card required. Get started in minutes. Cancel anytime.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <span className="text-amber-200 mr-2">✓</span>
                    14-day free trial
                  </li>
                  <li className="flex items-center">
                    <span className="text-amber-200 mr-2">✓</span>
                    Setup assistance included
                  </li>
                  <li className="flex items-center">
                    <span className="text-amber-200 mr-2">✓</span>
                    Full feature access
                  </li>
                  <li className="flex items-center">
                    <span className="text-amber-200 mr-2">✓</span>
                    No technical knowledge required
                  </li>
                </ul>
                <a
                  href="mailto:info@mymycafemate.com?subject=Free%20Trial%20Request%20for%20My-CafeMate&body=Hello%2C%0D%0A%0D%0AI%20would%20like%20to%20request%20a%2014-day%20free%20trial%20for%20My-CafeMate.%0D%0A%0D%0ABusiness%20Name%3A%20%0D%0AContact%20Person%3A%20%0D%0APhone%3A%20%0D%0AEmail%3A%20%0D%0ALocation%3A%20%0D%0A%0D%0AThank%20you!"
                  className="block text-center bg-white text-amber-900 py-3 rounded-lg font-bold hover:bg-amber-50 transition"
                >
                  Request Free Trial →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t-4 border-amber-700">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/logo.png"
                  alt="My-CafeMate Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold text-white">My-CafeMate</span>
              </div>
              <p className="text-sm">
                Complete cafe management solution built for Nepali cafes.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-amber-400 transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-amber-400 transition">Pricing</a></li>
                <li><a href="#contact" className="hover:text-amber-400 transition">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#contact" className="hover:text-amber-400 transition">Contact Us</a></li>
                <li><a href="/help" className="hover:text-amber-400 transition">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="hover:text-amber-400 transition">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-amber-400 transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm">&copy; 2026 My-CafeMate. All rights reserved.</p>
            <p className="text-sm mt-2">Made with ❤️ for cafes in Nepal</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 bg-white border border-amber-100 rounded-xl hover:shadow-lg hover:border-amber-300 transition group">
      <div className="text-5xl mb-4 group-hover:scale-110 transition">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  highlighted
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean
}) {
  return (
    <div className={`relative p-8 bg-white rounded-2xl transition ${
      highlighted
        ? 'border-2 border-amber-600 shadow-2xl scale-105 -mt-4'
        : 'border border-amber-200 shadow-lg'
    }`}>
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
            MOST POPULAR
          </div>
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="mb-2">
          <span className="text-4xl font-bold text-amber-900">{price}</span>
          <span className="text-gray-600 text-lg">{period}</span>
        </div>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-sm">
            <span className="text-amber-600 mr-3 mt-0.5 flex-shrink-0 font-bold">✓</span>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <a
        href="mailto:info@mymycafemate.com?subject=Free%20Trial%20Request%20for%20My-CafeMate&body=Hello%2C%0D%0A%0D%0AI%20would%20like%20to%20request%20a%2014-day%20free%20trial%20for%20My-CafeMate.%0D%0A%0D%0ABusiness%20Name%3A%20%0D%0AContact%20Person%3A%20%0D%0APhone%3A%20%0D%0AEmail%3A%20%0D%0ALocation%3A%20%0D%0A%0D%0AThank%20you!"
        className={`block text-center py-3 rounded-lg font-semibold transition ${
          highlighted
            ? 'bg-gradient-to-r from-amber-700 to-amber-800 text-white hover:from-amber-800 hover:to-amber-900 shadow-md'
            : 'border-2 border-amber-700 text-amber-800 hover:bg-amber-50'
        }`}
      >
        Start Free Trial
      </a>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-3xl md:text-4xl font-bold mb-2">{number}</div>
      <div className="text-amber-100 text-sm md:text-base">{label}</div>
    </div>
  );
}

function ContactItem({
  icon,
  label,
  value,
  link
}: {
  icon: string;
  label: string;
  value: string;
  link?: string;
}) {
  const content = (
    <div className="flex items-start">
      <span className="text-2xl mr-3">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-gray-600 mb-1">{label}</p>
        <p className="text-gray-900 font-medium">{value}</p>
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} className="hover:text-amber-700 transition">
        {content}
      </a>
    );
  }

  return content;
}
