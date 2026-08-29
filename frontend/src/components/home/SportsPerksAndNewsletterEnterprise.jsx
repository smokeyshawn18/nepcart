import React, { useState } from "react";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Mail,
  CheckCircle,
  HelpCircle,
  Dumbbell,
} from "lucide-react";

export function SportsPerksAndNewsletterEnterprise() {
  const [activeFaq, setActiveFaq] = useState(0);

  const perks = [
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: "Fast Express Shipping",
      desc: "Free delivery across Nepal on orders over $50",
    },
    {
      icon: <RotateCcw className="h-6 w-6 text-primary" />,
      title: "7-Day Gear Exchange",
      desc: "Hassle-free sizing exchange guarantee",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "100% Genuine Tackle",
      desc: "Directly sourced from official sports manufacturers",
    },
    {
      icon: <Headphones className="h-6 w-6 text-primary" />,
      title: "24/7 Athlete Support",
      desc: "Expert sizing & equipment advice via live chat",
    },
  ];

  const faqs = [
    {
      q: "How do I choose the correct shin guard or glove size?",
      a: "Refer to our interactive size guide on each product page or message our 24/7 team chat for live height and weight recommendations.",
    },
    {
      q: "Does NepCart provide bulk discounts for sports clubs?",
      a: "Yes! We offer up to 25% wholesale pricing on bulk team orders for schools, academies, and professional clubs in Nepal.",
    },
    {
      q: "What is your return policy for training accessories?",
      a: "Unused items in original packaging can be returned or exchanged within 7 days of delivery with zero restock fees.",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Enterprise Gear Buying Guide / FAQ */}
      <div className="rounded-3xl border border-base-content/10 bg-base-100 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="h-6 w-6 text-primary" />
          <div>
            <h3 className="text-xl font-black uppercase text-base-content tracking-tight">
              Sports Equipment Buying Guide & FAQs
            </h3>
            <p className="text-xs text-base-content/60">
              Quick answers to help you choose the right gear for your training
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              onClick={() => setActiveFaq(idx)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all ${
                activeFaq === idx
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-base-content/10 bg-base-200/50 hover:border-base-content/30"
              }`}
            >
              <h4 className="text-sm font-bold text-base-content flex items-center justify-between">
                <span>{faq.q}</span>
                <Dumbbell
                  className={`h-4 w-4 text-primary transition-transform ${activeFaq === idx ? "rotate-45" : ""}`}
                />
              </h4>
              <p className="text-xs text-base-content/70 mt-2 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Value Perks Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {perks.map((p) => (
          <div
            key={p.title}
            className="flex items-center gap-4 rounded-2xl border border-base-content/10 bg-base-100 p-5 shadow-sm hover:border-primary/40 transition-all"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              {p.icon}
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-base-content">
                {p.title}
              </h4>
              <p className="text-xs text-base-content/60 leading-tight mt-0.5">
                {p.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
