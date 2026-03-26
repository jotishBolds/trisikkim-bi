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
import { useTranslation } from "@/lib/i18n/use-translation";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

const DEFAULT_PHONE = "+91 7602569556";
const DEFAULT_EMAIL = "tribalresearchinst@gmail.com";
const DEFAULT_ADDRESS = "Assam Lingzey Rd, Chota Singtam, Sikkim 737135";

export default function ContactPage() {
  const { dict } = useTranslation();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
                {dict.contact.subtitle}
              </span>
            </div>
            <h1 className="font-display font-bold text-white text-[clamp(26px,4vw,44px)] leading-tight tracking-tight mb-3">
              {dict.contact.title}
            </h1>
            <p className="text-white/70 text-[15px] max-w-2xl leading-relaxed">
              {dict.contact.description}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border"
              style={{ background: "#1077A615", borderColor: "#1077A630" }}
            >
              <MapPin className="w-5 h-5 text-[#1077A6]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-[#1a1550] text-[22px] leading-tight">
                {dict.contact.visitOffice}
              </h2>
              <div
                className="w-8 h-[3px] rounded-full mt-1"
                style={{ background: "#f4c430" }}
              />
            </div>
          </div>

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

          <div className="mt-6 space-y-3">
            {[
              {
                icon: Phone,
                label: dict.contact.callUs,
                value: contactPhone,
                href: `tel:${contactPhone.replace(/\s/g, "")}`,
              },
              {
                icon: AtSign,
                label: dict.contact.writeToUs,
                value: contactEmail,
                href: `mailto:${contactEmail}`,
              },
              {
                icon: MapPin,
                label: dict.contact.visitUs,
                value: contactAddress,
                href: "https://maps.google.com/?q=27.2841523,88.6233368",
              },
            ].map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={
                  item.label === dict.contact.visitUs ? "_blank" : undefined
                }
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
                  style={{ background: "#1077A610", borderColor: "#1077A625" }}
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

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border"
              style={{ background: "#1077A615", borderColor: "#1077A630" }}
            >
              <MessageSquare className="w-5 h-5 text-[#1077A6]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-[#1a1550] text-[22px] leading-tight">
                {dict.contact.messageUs}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label={dict.contact.firstName}
                    name="firstName"
                    placeholder={dict.contact.firstNamePlaceholder}
                    value={form.firstName}
                    onChange={handleChange}
                    icon={<User className="w-4 h-4" />}
                  />
                  <FormField
                    label={dict.contact.lastName}
                    name="lastName"
                    placeholder={dict.contact.lastNamePlaceholder}
                    value={form.lastName}
                    onChange={handleChange}
                    icon={<User className="w-4 h-4" />}
                  />
                </div>

                <FormField
                  label={dict.contact.emailAddress}
                  name="email"
                  type="email"
                  placeholder={dict.contact.emailPlaceholder}
                  value={form.email}
                  onChange={handleChange}
                  icon={<AtSign className="w-4 h-4" />}
                />

                <div>
                  <label className="block text-[12px] font-bold text-[#1a1550]/70 uppercase tracking-wide mb-1.5">
                    {dict.contact.yourMessage}
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder={dict.contact.messagePlaceholder}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-[14px] text-[#1a1550] bg-[#f8f7fc] border border-[#1077A6]/15 rounded-lg outline-none focus:border-[#1077A6]/40 focus:ring-2 focus:ring-[#1077A6]/10 transition-all duration-200 resize-none placeholder:text-[#1a1550]/30"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-[13px] font-medium">
                    {error}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={
                    submitting ||
                    !form.firstName ||
                    !form.email ||
                    !form.message
                  }
                  className="w-full flex items-center justify-center gap-2 bg-[#1077A6] hover:bg-[#f4c430] text-white hover:text-black font-semibold py-3.5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? dict.contact.sending : dict.contact.sendMessage}
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-display font-bold text-[#1a1550] text-xl mb-2">
                  {dict.contact.thankYouTitle}
                </h3>
                <p className="text-[#1a1550]/60 text-[14px] max-w-sm mx-auto leading-relaxed">
                  {dict.contact.thankYouMessage}
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
                  className="mt-6 text-[#1077A6] font-semibold text-[13px] hover:text-[#f4c430] transition-colors"
                >
                  {dict.contact.sendAnother}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

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
      <label className="block text-[12px] font-bold text-[#1a1550]/70 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1077A6]/40">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 text-[14px] text-[#1a1550] bg-[#f8f7fc] border border-[#1077A6]/15 rounded-lg outline-none focus:border-[#1077A6]/40 focus:ring-2 focus:ring-[#1077A6]/10 transition-all duration-200 placeholder:text-[#1a1550]/30"
        />
      </div>
    </div>
  );
}
