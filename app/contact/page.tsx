"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  User,
  MessageSquare,
  AtSign,
} from "lucide-react";

/* ─── Framer variants ───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

/* ═══════════════════════════════════════════════════════════════════
   CONTACT PAGE
═══════════════════════════════════════════════════════════════════ */
const DEFAULT_PHONE = "+91 7602569556";
const DEFAULT_EMAIL = "tribalresearchinst@gmail.com";
const DEFAULT_ADDRESS = "Assam Lingzey Rd, Chota Singtam, Sikkim 737135";

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Dynamic contact info from settings
  const [contactPhone, setContactPhone] = useState(DEFAULT_PHONE);
  const [contactEmail, setContactEmail] = useState(DEFAULT_EMAIL);
  const [contactAddress, setContactAddress] = useState(DEFAULT_ADDRESS);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          const s = d.data as Record<string, string>;
          if (s.footer_phone) setContactPhone(s.footer_phone);
          if (s.footer_email) setContactEmail(s.footer_email);
          if (s.footer_address) setContactAddress(s.footer_address);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.message) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Failed to send message.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7fc] font-body">
      {/* ── Hero banner ── */}
      <div className="bg-[#1077A6] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#f4c430 1px, transparent 1px), linear-gradient(90deg, #f4c430 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-[#f4c430]/8 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-[#f4c430]/15 flex items-center justify-center">
                <Mail className="w-3.5 h-3.5 text-[#f4c430]" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[.18em] text-[#f4c430]">
                Contact Us
              </span>
            </div>
            <h1 className="font-display font-bold text-white text-[clamp(26px,4vw,44px)] leading-tight tracking-tight mb-3">
              Get In Touch
            </h1>
            <p className="text-white/70 text-[15px] max-w-2xl leading-relaxed">
              You may either contact the Institute directly by using the phone
              numbers or you can even type in your message and send us through
              the contact form below.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ── LEFT: Map ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
        >
          {/* Section heading */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border"
              style={{
                background: "#1077A615",
                borderColor: "#1077A630",
              }}
            >
              <MapPin className="w-5 h-5 text-[#1077A6]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-[#1a1550] text-[22px] leading-tight">
                Visit Our Office
              </h2>
              <div
                className="w-8 h-[3px] rounded-full mt-1"
                style={{ background: "#f4c430" }}
              />
            </div>
          </div>

          {/* Map embed */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-[#1077A6]/10 h-[420px] lg:h-[460px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.7820000000005!2d88.6232004!3d27.284946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e6a596fe78ce07%3A0xa84feb5ebf3a67e7!2sTRI%20ASSAM%20LINGZEY!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="TRITC Location Map"
            />
          </div>

          {/* Contact info cards */}
          <div className="mt-6 space-y-3">
            {[
              {
                icon: Phone,
                label: "Call Us",
                value: contactPhone,
                href: `tel:${contactPhone.replace(/\s/g, "")}`,
              },
              {
                icon: AtSign,
                label: "Write to Us",
                value: contactEmail,
                href: `mailto:${contactEmail}`,
              },
              {
                icon: MapPin,
                label: "Visit Us",
                value: contactAddress,
                href: "https://maps.google.com/?q=27.2841523,88.6233368",
              },
            ].map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.label === "Visit Us" ? "_blank" : undefined}
                rel="noopener noreferrer"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i + 1}
                className="group flex items-start gap-4 p-4 rounded-xl bg-white border border-[#1077A6]/10 hover:border-[#f4c430]/60 hover:shadow-md transition-all duration-300"
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: "#1077A610",
                    borderColor: "#1077A625",
                  }}
                >
                  <item.icon
                    className="w-4.5 h-4.5 text-[#1077A6]"
                    style={{ width: 18, height: 18 }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#f4c430] mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-[#1a1550] text-[13.5px] font-medium leading-snug break-all">
                    {item.value}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT: Contact Form ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
        >
          {/* Section heading */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border"
              style={{
                background: "#1077A615",
                borderColor: "#1077A630",
              }}
            >
              <MessageSquare className="w-5 h-5 text-[#1077A6]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-[#1a1550] text-[22px] leading-tight">
                Message Us
              </h2>
              <div
                className="w-8 h-[3px] rounded-full mt-1"
                style={{ background: "#f4c430" }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#1077A6]/10 shadow-sm p-7 md:p-8">
            {!submitted ? (
              <div className="space-y-5">
                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    name="firstName"
                    placeholder="e.g. Tenzin"
                    value={form.firstName}
                    onChange={handleChange}
                    icon={<User className="w-4 h-4" />}
                  />
                  <FormField
                    label="Last Name"
                    name="lastName"
                    placeholder="e.g. Lepcha"
                    value={form.lastName}
                    onChange={handleChange}
                    icon={<User className="w-4 h-4" />}
                  />
                </div>

                {/* Email */}
                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  icon={<AtSign className="w-4 h-4" />}
                />

                {/* Message */}
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-[.14em] text-[#1a1550]/70 mb-2">
                    Comment or Message
                  </label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-3.5 text-[#1077A6]/50 pointer-events-none">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Write your message here..."
                      className="w-full pl-10 pr-4 py-3 text-[14px] text-[#1a1550] bg-[#f8f7fc] border border-[#1077A6]/15 rounded-xl resize-none outline-none focus:border-[#1077A6]/50 focus:ring-2 focus:ring-[#1077A6]/10 transition-all duration-200 placeholder:text-[#1a1550]/30"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  className="group relative w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-[14px] overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98]"
                  style={{ background: "#1077A6", color: "white" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#0e6590";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#1077A6";
                  }}
                >
                  {/* Shimmer */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                  <Send className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform duration-200" />
                  <span className="relative z-10">Submit Message</span>
                </button>

                <p className="text-center text-[12px] text-[#1a1550]/40">
                  We typically respond within 2–3 working days.
                </p>
              </div>
            ) : (
              /* Success state */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center py-14 text-center"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-lg"
                  style={{ background: "#f4c430" }}
                >
                  <Send className="w-7 h-7 text-[#1a1550]" />
                </div>
                <h3 className="font-display font-bold text-[#1a1550] text-[22px] mb-2">
                  Message Sent!
                </h3>
                <p className="text-[#1a1550]/55 text-[14px] leading-relaxed max-w-xs">
                  Thank you for reaching out. We will get back to you within 2–3
                  working days.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      firstName: "",
                      lastName: "",
                      email: "",
                      message: "",
                    });
                  }}
                  className="mt-6 px-5 py-2.5 rounded-lg text-[13px] font-semibold border transition-all duration-200"
                  style={{
                    borderColor: "#1077A640",
                    color: "#1077A6",
                    background: "#1077A608",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#1077A618";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#1077A608";
                  }}
                >
                  Send Another Message
                </button>
              </motion.div>
            )}
          </div>

          {/* Decorative info note */}
          <div
            className="mt-5 rounded-xl p-4 border flex items-start gap-3"
            style={{ background: "#f4c43010", borderColor: "#f4c43030" }}
          >
            <div
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
              style={{ background: "#f4c43025" }}
            >
              <Mail className="w-4 h-4 text-[#1a1550]" />
            </div>
            <p className="text-[#1a1550]/65 text-[13px] leading-relaxed">
              For urgent matters, please call us directly at{" "}
              <a
                href={`tel:${contactPhone.replace(/\s/g, "")}`}
                className="font-semibold text-[#1077A6] hover:underline"
              >
                {contactPhone}
              </a>{" "}
              during office hours (Monday–Friday, 10:00 AM – 5:00 PM).
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Form Field ─────────────────────────────────────────────────── */
function FormField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[12px] font-bold uppercase tracking-[.14em] text-[#1a1550]/70 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-3.5 text-[#1077A6]/50 pointer-events-none">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 text-[14px] text-[#1a1550] bg-[#f8f7fc] border border-[#1077A6]/15 rounded-xl outline-none focus:border-[#1077A6]/50 focus:ring-2 focus:ring-[#1077A6]/10 transition-all duration-200 placeholder:text-[#1a1550]/30"
        />
      </div>
    </div>
  );
}
