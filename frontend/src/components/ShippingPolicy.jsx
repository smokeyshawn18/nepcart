import ScrollToTop from "../lib/scroll";
import {
  Truck,
  Clock3,
  MapPinned,
  Package,
  BadgeInfo,
  ShieldCheck,
  Mail,
  AlertCircle,
} from "lucide-react";

const sections = [
  {
    icon: Clock3,
    title: "Order Processing",
    content:
      "Orders are typically processed within 1–3 business days after payment confirmation. Orders placed on weekends or public holidays will be processed on the next working day.",
  },
  {
    icon: Truck,
    title: "Delivery Time",
    content:
      "Inside Nepal, delivery usually takes 3–7 business days depending on your location and courier availability. Remote areas may take longer during busy seasons or weather disruptions.",
  },
  {
    icon: MapPinned,
    title: "Shipping Charges",
    content:
      "Kathmandu Valley shipping is Rs. 100. Outside the Valley, shipping ranges from Rs. 150–250 depending on distance and delivery zone. Free shipping may apply on orders above Rs. 5000.",
  },
  {
    icon: Package,
    title: "Tracking Information",
    content:
      "Once your order is shipped, you will receive a tracking number by SMS or email so you can monitor your delivery status.",
  },
  {
    icon: BadgeInfo,
    title: "Delivery Delays",
    content:
      "Delivery may be delayed due to high order volume, courier issues, natural events, inaccurate addresses, or situations beyond our control.",
  },
  {
    icon: ShieldCheck,
    title: "Failed Delivery",
    content:
      "If a delivery attempt fails because of an incorrect address, unreachable phone number, or customer unavailability, the order may be rescheduled or returned to us.",
  },
];

export default function ShippingPolicy() {
  return (
    <section className="container mx-auto px-4 py-16 max-w-5xl">
      <ScrollToTop />

      <div className="rounded-3xl border border-base-300 bg-gradient-to-br from-base-200/80 to-base-100 p-8 md:p-12 shadow-sm">
        <div className="flex items-center gap-3 text-primary mb-4">
          <Truck className="w-7 h-7" />
          <span className="uppercase tracking-[0.22em] text-sm font-semibold">
            Shipping Policy
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold font-mono uppercase leading-tight">
          Fast, clear, and reliable delivery
        </h1>

        <p className="mt-4 max-w-3xl text-base-content/70 leading-7">
          At <strong>NEPCART</strong>, we aim to make shipping simple and
          transparent so you know exactly what to expect after placing an order.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="badge badge-outline">Last updated: July 2026</span>
          <span className="badge badge-outline">Nationwide Nepal Shipping</span>
          <span className="badge badge-outline">Tracking Available</span>
        </div>
      </div>

      <div className="mt-10 grid gap-6">
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
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                  <p className="mt-2 text-base-content/75 leading-7">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
          <div className="flex items-center gap-3 mb-3 text-warning">
            <AlertCircle className="w-5 h-5" />
            <h3 className="text-xl font-semibold text-base-content">
              Important Notes
            </h3>
          </div>
          <ul className="list-disc pl-6 space-y-2 text-base-content/75 leading-7">
            <li>
              Delivery times are estimates and may vary depending on courier and
              location.
            </li>
            <li>
              Shipping fees are calculated based on delivery area and package
              size.
            </li>
            <li>
              During sale periods or festive seasons, order processing may take
              longer.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-base-300 bg-base-100 p-6">
          <div className="flex items-center gap-3 mb-3 text-info">
            <Mail className="w-5 h-5" />
            <h3 className="text-xl font-semibold text-base-content">
              Need Help?
            </h3>
          </div>
          <p className="text-base-content/75 leading-7">
            If your order is delayed, incomplete, or you need shipping support,
            contact our support team with your order number and registered phone
            number for faster assistance.
          </p>
        </div>
      </div>
    </section>
  );
}
