import ScrollToTop from "../lib/scroll";
import {
  ShieldCheck,
  LockKeyhole,
  Cookie,
  Database,
  Mail,
  Eye,
  UserCheck,
  Clock3,
  FileText,
  AlertCircle,
} from "lucide-react";

const sections = [
  {
    icon: ShieldCheck,
    title: "Information We Collect",
    content:
      "We may collect your name, email address, phone number, shipping address, billing details, order history, and account information when you place an order or create an account.",
  },
  {
    icon: LockKeyhole,
    title: "How We Use Your Information",
    content:
      "We use your information to process orders, manage payments, provide customer support, improve our services, and send important updates about your purchases.",
  },
  {
    icon: Cookie,
    title: "Cookies and Tracking",
    content:
      "We use cookies and similar technologies to remember preferences, analyze traffic, improve performance, and personalize your shopping experience.",
  },
  {
    icon: Database,
    title: "Data Sharing",
    content:
      "We only share necessary information with trusted service providers such as payment processors, shipping partners, and analytics tools required to operate our business.",
  },
  {
    icon: Clock3,
    title: "Data Retention",
    content:
      "We keep personal data only as long as needed for order processing, legal obligations, dispute resolution, and business records, unless a longer period is required by law.",
  },
  {
    icon: Eye,
    title: "Security",
    content:
      "We use reasonable technical and organizational safeguards to protect your data from unauthorized access, loss, misuse, or alteration.",
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    content:
      "Depending on your location, you may request access, correction, deletion, or restriction of your personal information, and you may also object to certain processing activities.",
  },
  {
    icon: Mail,
    title: "Contact Us",
    content:
      "If you have questions about this Privacy Policy or your personal data, you can contact our support team at support@sported.com.",
  },
];

export default function PrivacyPolicy() {
  return (
    <section className="container mx-auto px-4 py-16 max-w-4xl">
      <ScrollToTop />

      <div className="mb-10 rounded-3xl bg-base-200/70 p-8 md:p-10 border border-base-300 shadow-sm">
        <div className="flex items-center gap-3 text-primary mb-4">
          <ShieldCheck className="w-7 h-7" />
          <span className="uppercase tracking-[0.2em] text-sm font-semibold">
            Privacy Policy
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold font-mono uppercase leading-tight">
          Your privacy matters
        </h1>

        <p className="mt-4 text-base-content/70 max-w-2xl">
          At <strong>SPORTED</strong>, we are committed to protecting your
          personal data and being transparent about how we collect, use, and
          safeguard your information.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="badge badge-outline">Last updated: July 2026</span>
          <span className="badge badge-outline">Ecommerce Policy</span>
          <span className="badge badge-outline">Customer Data Protection</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl bg-base-100 border border-base-300 p-6">
          <h2 className="text-2xl font-semibold mb-3">Overview</h2>
          <p className="text-base-content/80 leading-7">
            This Privacy Policy explains what information we collect, why we
            collect it, how we use it, and the choices you have over your data
            when you use our website and services.
          </p>
        </div>

        <div className="grid gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{section.title}</h3>
                    <p className="mt-2 text-base-content/75 leading-7">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
            <div className="flex items-center gap-3 mb-3 text-warning">
              <AlertCircle className="w-5 h-5" />
              <h2 className="text-xl font-semibold text-base-content">
                Children’s Privacy
              </h2>
            </div>
            <p className="text-base-content/75 leading-7">
              Our services are not intended for children under 13, and we do not
              knowingly collect personal information from them.
            </p>
          </div>

          <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
            <div className="flex items-center gap-3 mb-3 text-info">
              <FileText className="w-5 h-5" />
              <h2 className="text-xl font-semibold text-base-content">
                Policy Changes
              </h2>
            </div>
            <p className="text-base-content/75 leading-7">
              We may update this policy from time to time. Any changes will be
              posted on this page with a revised last updated date.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
