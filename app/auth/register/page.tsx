"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldX,
  ArrowRight,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [registrationEnabled, setRegistrationEnabled] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    fetch("/api/auth/register/status")
      .then((r) => r.json())
      .then((d) => setRegistrationEnabled(d.enabled))
      .catch(() => setRegistrationEnabled(false));
  }, []);

  const passwordChecks = {
    length: password.length >= 6,
    match: password.length > 0 && password === confirmPassword,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Registration failed.");
      } else {
        router.push("/auth/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Loadings
  if (registrationEnabled === null) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-white">
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Loader2 className="w-6 h-6 text-[#1077a6] animate-spin" />
          <p className="text-[#1a1550]/40 text-sm">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Disabled
  if (!registrationEnabled) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-white px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-[0.12]"
            style={{
              background:
                "radial-gradient(circle, #1077a6 0%, transparent 70%)",
            }}
            animate={{ x: [0, 35, 0], y: [0, 25, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-[0.08]"
            style={{
              background:
                "radial-gradient(circle, #1a1550 0%, transparent 70%)",
            }}
            animate={{ x: [0, -25, 0], y: [0, -30, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          className="w-full max-w-sm text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <ShieldX className="w-8 h-8 text-red-400" />
          </motion.div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1a1550] mb-2">
            Registration Disabled
          </h1>
          <p className="text-[#1a1550]/40 text-xs sm:text-sm mb-6 max-w-xs mx-auto">
            New user registration is currently disabled. Contact the
            administrator.
          </p>
          <Button
            asChild
            className="h-10 px-6 rounded-xl bg-linear-to-r from-[#1077a6] to-[#0e6590] text-white shadow-lg shadow-[#1077a6]/20 font-semibold text-sm"
          >
            <Link href="/auth/login" className="gap-2">
              Go to Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  // Form
  return (
    <div className="min-h-[100dvh] flex items-center justify-center relative overflow-hidden bg-white px-4 py-6">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full opacity-[0.15]"
          style={{
            background: "radial-gradient(circle, #1077a6 0%, transparent 70%)",
          }}
          animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-72 h-72 sm:w-[380px] sm:h-[380px] rounded-full opacity-[0.12]"
          style={{
            background: "radial-gradient(circle, #1a1550 0%, transparent 70%)",
          }}
          animate={{ x: [0, 25, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(circle, #f4c430 0%, transparent 70%)",
          }}
          animate={{ x: [0, -35, 0], y: [0, 18, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/5 w-40 h-40 rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #f4c430 0%, transparent 70%)",
          }}
          animate={{ x: [0, 20, 0], y: [0, -25, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(#1077a6 1px, transparent 1px), linear-gradient(90deg, #1077a6 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#f4c430]/15"
            style={{ top: `${20 + i * 20}%`, right: `${10 + i * 18}%` }}
            animate={{ y: [-12, 12, -12], opacity: [0.15, 0.35, 0.15] }}
            transition={{
              duration: 3.5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <motion.div
        className="w-full max-w-[400px] relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-4" variants={itemVariants}>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1550] tracking-tight">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-[#1a1550]/40 mt-1">
            Set up your admin access for TRITC CMS
          </p>
        </motion.div>

        {/* Card */}
        <motion.div variants={itemVariants}>
          <Card className="border border-[#f4c430]/12 shadow-xl shadow-[#1077a6]/5 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-5 pb-3 px-5 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-2 bg-red-50 text-red-700 rounded-xl p-2.5 text-xs sm:text-sm border border-red-100"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Name */}
                <motion.div className="space-y-1" variants={itemVariants}>
                  <Label
                    htmlFor="name"
                    className="text-xs sm:text-sm font-semibold text-[#1a1550]"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <User
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                        focusedField === "name"
                          ? "text-[#1077a6]"
                          : "text-[#1a1550]/25"
                      }`}
                    />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder="John Doe"
                      className="pl-10 h-10 border-[#1077a6]/12 rounded-xl text-sm text-[#1a1550] placeholder:text-[#1a1550]/20 focus-visible:ring-[#1077a6]/20 focus-visible:border-[#1077a6] transition-all"
                    />
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-linear-to-r from-[#f4c430] to-[#1077a6] rounded-full"
                      initial={{ width: "0%" }}
                      animate={{
                        width: focusedField === "name" ? "85%" : "0%",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div className="space-y-1" variants={itemVariants}>
                  <Label
                    htmlFor="email"
                    className="text-xs sm:text-sm font-semibold text-[#1a1550]"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                        focusedField === "email"
                          ? "text-[#1077a6]"
                          : "text-[#1a1550]/25"
                      }`}
                    />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder="admin@tritc.sikkim.gov.in"
                      className="pl-10 h-10 border-[#1077a6]/12 rounded-xl text-sm text-[#1a1550] placeholder:text-[#1a1550]/20 focus-visible:ring-[#1077a6]/20 focus-visible:border-[#1077a6] transition-all"
                    />
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-linear-to-r from-[#f4c430] to-[#1077a6] rounded-full"
                      initial={{ width: "0%" }}
                      animate={{
                        width: focusedField === "email" ? "85%" : "0%",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div className="space-y-1" variants={itemVariants}>
                  <Label
                    htmlFor="password"
                    className="text-xs sm:text-sm font-semibold text-[#1a1550]"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                        focusedField === "password"
                          ? "text-[#1077a6]"
                          : "text-[#1a1550]/25"
                      }`}
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder="••••••••"
                      className="pl-10 pr-11 h-10 border-[#1077a6]/12 rounded-xl text-sm text-[#1a1550] placeholder:text-[#1a1550]/20 focus-visible:ring-[#1077a6]/20 focus-visible:border-[#1077a6] transition-all"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a1550]/25 hover:text-[#1077a6] transition-colors p-0.5"
                      whileTap={{ scale: 0.85 }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={showPassword ? "hide" : "show"}
                          initial={{ opacity: 0, rotateY: 90 }}
                          animate={{ opacity: 1, rotateY: 0 }}
                          exit={{ opacity: 0, rotateY: -90 }}
                          transition={{ duration: 0.15 }}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </motion.button>
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-linear-to-r from-[#f4c430] to-[#1077a6] rounded-full"
                      initial={{ width: "0%" }}
                      animate={{
                        width: focusedField === "password" ? "85%" : "0%",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>

                {/* Confirm Password */}
                <motion.div className="space-y-1" variants={itemVariants}>
                  <Label
                    htmlFor="confirmPassword"
                    className="text-xs sm:text-sm font-semibold text-[#1a1550]"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                        focusedField === "confirmPassword"
                          ? "text-[#1077a6]"
                          : "text-[#1a1550]/25"
                      }`}
                    />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder="••••••••"
                      className="pl-10 h-10 border-[#1077a6]/12 rounded-xl text-sm text-[#1a1550] placeholder:text-[#1a1550]/20 focus-visible:ring-[#1077a6]/20 focus-visible:border-[#1077a6] transition-all"
                    />
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-linear-to-r from-[#f4c430] to-[#1077a6] rounded-full"
                      initial={{ width: "0%" }}
                      animate={{
                        width:
                          focusedField === "confirmPassword" ? "85%" : "0%",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>

                {/* Password checks */}
                <AnimatePresence>
                  {password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-2"
                    >
                      <motion.div
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] sm:text-xs transition-all duration-300 ${
                          passwordChecks.length
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-[#1a1550]/[0.03] border-[#1a1550]/10 text-[#1a1550]/35"
                        }`}
                        layout
                      >
                        {passwordChecks.length ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                        6+ characters
                      </motion.div>
                      {confirmPassword.length > 0 && (
                        <motion.div
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] sm:text-xs transition-all duration-300 ${
                            passwordChecks.match
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-red-50 border-red-200 text-red-600"
                          }`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          layout
                        >
                          {passwordChecks.match ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                          Passwords match
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.div variants={itemVariants} className="pt-0.5">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 sm:h-11 rounded-xl text-sm font-semibold bg-linear-to-r from-[#1077a6] to-[#0e6590] hover:from-[#0e6590] hover:to-[#1a1550] text-white shadow-lg shadow-[#1077a6]/20 hover:shadow-[#1077a6]/30 transition-all duration-500 group relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-[#f4c430]/0 via-[#f4c430]/10 to-[#f4c430]/0"
                      animate={{ x: ["-200%", "200%"] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </Button>
                </motion.div>
              </form>
            </CardContent>

            <CardFooter className="pt-0 pb-4 px-5 sm:px-6">
              <div className="w-full space-y-2.5">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#1077a6]/8" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-[#1a1550]/25">or</span>
                  </div>
                </div>
                <p className="text-center text-xs sm:text-sm text-[#1a1550]/35">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-[#1077a6] font-semibold hover:text-[#0e6590] transition-colors relative group"
                  >
                    Sign In
                    <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[#1077a6] group-hover:w-full transition-all duration-300" />
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div className="mt-3 text-center" variants={itemVariants}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1550]/[0.03] text-[#1a1550]/30 text-[10px] sm:text-xs">
            <Lock className="w-3 h-3" />
            Your data is securely encrypted
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
