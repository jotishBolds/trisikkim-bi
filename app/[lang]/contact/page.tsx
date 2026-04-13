"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  User,
  MessageSquare,
  AtSign,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/use-translation";
import PageHero from "@/components/PageHero";

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

function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const chars = value.split("");
    chars[i] = v.slice(-1);
    const next = chars.join("");
    onChange(next);
    if (v && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onChange(pasted.padEnd(6, "").slice(0, 6));
    if (pasted.length > 0) {
      inputs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-11 h-12 text-center text-[18px] font-bold text-[#1a1550] bg-[#f8f7fc] border-2 border-[#1077A6]/20 rounded-lg outline-none focus:border-[#1077A6] focus:ring-2 focus:ring-[#1077A6]/15 transition-all duration-200 disabled:opacity-50"
        />
      ))}
    </div>
  );
}

export default function ContactPage() {
  const { dict } = useTranslation();
  const c = dict.contact;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [otpStep, setOtpStep] = useState<"idle" | "sent" | "verified">("idle");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

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

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  useEffect(() => {
    if (otpStep !== "idle") {
      setOtpStep("idle");
      setOtp("");
      setOtpError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.email]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async () => {
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setOtpError("Please enter a valid email address first.");
      return;
    }
    setSendingOtp(true);
    setOtpError("");
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpStep("sent");
        setOtp("");
        setResendCountdown(60);
      } else {
        setOtpError(data.error || "Failed to send OTP.");
      }
    } catch {
      setOtpError("Failed to send OTP. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError("Please enter the 6-digit OTP.");
      return;
    }
    setVerifyingOtp(true);
    setOtpError("");
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpStep("verified");
        setOtpError("");
      } else {
        setOtpError(data.error || "Invalid OTP.");
      }
    } catch {
      setOtpError("Failed to verify OTP. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.message) return;
    if (otpStep !== "verified") {
      setError(c.otpRequired);
      return;
    }
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
      <PageHero
        badge={c.subtitle}
        title={c.title}
        icon={<Mail className="w-3.5 h-3.5 text-[#f4c430]" />}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left — map + contact info */}
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
                {c.visitOffice}
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
                label: c.callUs,
                value: contactPhone,
                href: `tel:${contactPhone.replace(/\s/g, "")}`,
              },
              {
                icon: AtSign,
                label: c.writeToUs,
                value: contactEmail,
                href: `mailto:${contactEmail}`,
              },
              {
                icon: MapPin,
                label: c.visitUs,
                value: contactAddress,
                href: "https://maps.google.com/?q=27.2841523,88.6233368",
              },
            ].map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.label === c.visitUs ? "_blank" : undefined}
                rel="noopener noreferrer"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i + 1}
                className="group flex items-start gap-4 p-4 rounded-xl bg-white border border-[#1077A6]/10 hover:border-[#f4c430]/60 hover:shadow-md transition-all duration-300"
              >
                <div
                  className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                  style={{ background: "#1077A610", borderColor: "#1077A625" }}
                >
                  <item.icon
                    style={{ width: 18, height: 18 }}
                    className="text-[#1077A6]"
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

        {/* Right — form with OTP */}
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
                {c.messageUs}
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
                    label={c.firstName}
                    name="firstName"
                    placeholder={c.firstNamePlaceholder}
                    value={form.firstName}
                    onChange={handleChange}
                    icon={<User className="w-4 h-4" />}
                  />
                  <FormField
                    label={c.lastName}
                    name="lastName"
                    placeholder={c.lastNamePlaceholder}
                    value={form.lastName}
                    onChange={handleChange}
                    icon={<User className="w-4 h-4" />}
                  />
                </div>

                {/* Email + OTP */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[12px] font-bold text-[#1a1550]/70 uppercase tracking-wide mb-1.5">
                      {c.emailAddress}
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1077A6]/40">
                          <AtSign className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder={c.emailPlaceholder}
                          disabled={otpStep === "verified"}
                          className="w-full pl-10 pr-4 py-3 text-[14px] text-[#1a1550] bg-[#f8f7fc] border border-[#1077A6]/15 rounded-lg outline-none focus:border-[#1077A6]/40 focus:ring-2 focus:ring-[#1077A6]/10 transition-all duration-200 placeholder:text-[#1a1550]/30 disabled:opacity-60"
                        />
                      </div>
                      {otpStep === "verified" ? (
                        <div className="flex items-center gap-1.5 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-[12px] font-semibold whitespace-nowrap">
                          <CheckCircle2 className="w-4 h-4" />
                          {c.emailVerified}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={
                            sendingOtp ||
                            !form.email ||
                            (otpStep === "sent" && resendCountdown > 0)
                          }
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#1077A6] hover:bg-[#1077A6]/90 text-white text-[12px] font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {sendingOtp ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <ShieldCheck className="w-3.5 h-3.5" />
                          )}
                          {sendingOtp ? c.sendingOtp : c.getOtp}
                        </button>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {otpStep === "sent" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-[#f0f8ff] border border-[#1077A6]/20 rounded-xl p-4 space-y-4">
                          <div className="flex items-center gap-2 text-[#1077A6] text-[12.5px] font-medium">
                            <Mail className="w-4 h-4 shrink-0" />
                            <span>
                              {c.otpSent}{" "}
                              <strong className="text-[#1a1550]">
                                {form.email}
                              </strong>
                            </span>
                          </div>

                          <OtpInput
                            value={otp}
                            onChange={setOtp}
                            disabled={verifyingOtp}
                          />

                          {otpError && (
                            <p className="text-red-500 text-[12px] font-medium text-center">
                              {otpError}
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={verifyingOtp || otp.length !== 6}
                            className="w-full flex items-center justify-center gap-2 bg-[#1077A6] hover:bg-[#1077A6]/90 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-[13px]"
                          >
                            {verifyingOtp ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            )}
                            {verifyingOtp ? c.verifying : c.verifyOtp}
                          </button>

                          <div className="text-center">
                            {resendCountdown > 0 ? (
                              <p className="text-[#1a1550]/40 text-[12px]">
                                {c.resendIn} {resendCountdown}
                                {c.seconds}
                              </p>
                            ) : (
                              <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={sendingOtp}
                                className="flex items-center gap-1.5 mx-auto text-[12px] font-semibold text-[#1077A6] hover:text-[#f4c430] transition-colors disabled:opacity-50"
                              >
                                <RefreshCw className="w-3 h-3" />
                                {c.resendOtp}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {otpStep === "verified" && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-green-700 text-[13px] font-medium"
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        {c.emailVerified} — {form.email}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#1a1550]/70 uppercase tracking-wide mb-1.5">
                    {c.yourMessage}
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder={c.messagePlaceholder}
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
                    !form.message ||
                    otpStep !== "verified"
                  }
                  className="w-full flex items-center justify-center gap-2 bg-[#1077A6] hover:bg-[#f4c430] text-white hover:text-black font-semibold py-3.5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? c.sending : c.sendMessage}
                </button>

                {otpStep !== "verified" && (
                  <p className="text-center text-[11.5px] text-[#1a1550]/35 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {c.otpRequired}
                  </p>
                )}
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
                  {c.thankYouTitle}
                </h3>
                <p className="text-[#1a1550]/60 text-[14px] max-w-sm mx-auto leading-relaxed">
                  {c.thankYouMessage}
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
                    setOtpStep("idle");
                    setOtp("");
                  }}
                  className="mt-6 text-[#1077A6] font-semibold text-[13px] hover:text-[#f4c430] transition-colors"
                >
                  {c.sendAnother}
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
