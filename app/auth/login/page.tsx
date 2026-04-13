"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Loader2,
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
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center relative overflow-hidden bg-white px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-24 -left-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full opacity-[0.15]"
          style={{
            background: "radial-gradient(circle, #1077a6 0%, transparent 70%)",
          }}
          animate={{ x: [0, 35, 0], y: [0, 25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full opacity-[0.12]"
          style={{
            background: "radial-gradient(circle, #1a1550 0%, transparent 70%)",
          }}
          animate={{ x: [0, -25, 0], y: [0, -35, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-56 h-56 sm:w-72 sm:h-72 rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, #f4c430 0%, transparent 70%)",
          }}
          animate={{ x: [0, 40, 0], y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-44 h-44 rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, #1077a6 0%, transparent 70%)",
          }}
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
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
            className="absolute w-1.5 h-1.5 rounded-full bg-[#1077a6]/15"
            style={{ top: `${25 + i * 18}%`, left: `${12 + i * 20}%` }}
            animate={{
              y: [-15, 15, -15],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: 3.5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
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
        <motion.div className="text-center mb-5" variants={itemVariants}>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1550] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-[#1a1550]/40 mt-1">
            Sign in to access the admin panel
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border border-[#1077a6]/10 shadow-xl shadow-[#1077a6]/5 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-5 pb-4 px-5 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-2 bg-red-50 text-red-700 rounded-xl p-3 text-xs sm:text-sm border border-red-100"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div className="space-y-1.5" variants={itemVariants}>
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
                      className="pl-10 h-11 border-[#1077a6]/12 rounded-xl text-sm text-[#1a1550] placeholder:text-[#1a1550]/20 focus-visible:ring-[#1077a6]/20 focus-visible:border-[#1077a6] transition-all"
                    />
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-linear-to-r from-[#1077a6] to-[#f4c430] rounded-full"
                      initial={{ width: "0%" }}
                      animate={{
                        width: focusedField === "email" ? "85%" : "0%",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>

                <motion.div className="space-y-1.5" variants={itemVariants}>
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
                      className="pl-10 pr-11 h-11 border-[#1077a6]/12 rounded-xl text-sm text-[#1a1550] placeholder:text-[#1a1550]/20 focus-visible:ring-[#1077a6]/20 focus-visible:border-[#1077a6] transition-all"
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
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-linear-to-r from-[#1077a6] to-[#f4c430] rounded-full"
                      initial={{ width: "0%" }}
                      animate={{
                        width: focusedField === "password" ? "85%" : "0%",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl text-sm font-semibold bg-linear-to-r from-[#1077a6] to-[#0e6590] hover:from-[#0e6590] hover:to-[#1a1550] text-white shadow-lg shadow-[#1077a6]/20 hover:shadow-[#1077a6]/30 transition-all duration-500 group relative overflow-hidden"
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
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </Button>
                </motion.div>
              </form>
            </CardContent>

            <CardFooter className="pt-0 pb-5 px-5 sm:px-6">
              <div className="w-full space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#1077a6]/8" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-[#1a1550]/25">or</span>
                  </div>
                </div>
                <p className="text-center text-xs sm:text-sm text-[#1a1550]/35">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="text-[#1077a6] font-semibold hover:text-[#0e6590] transition-colors relative group"
                  >
                    Create Account
                    <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[#1077a6] group-hover:w-full transition-all duration-300" />
                  </Link>
                </p>
                <p className="text-center text-xs sm:text-sm text-[#1a1550]/35">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1 text-[#1077a6] font-semibold hover:text-[#0e6590] transition-colors relative group"
                  >
                    ← Go to Home
                    <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[#1077a6] group-hover:w-full transition-all duration-300" />
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div className="mt-4 text-center" variants={itemVariants}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1550]/[0.03] text-[#1a1550]/30 text-[10px] sm:text-xs">
            <Lock className="w-3 h-3" />
            Secured with end-to-end encryption
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
