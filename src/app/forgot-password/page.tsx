"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSent(true);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-accent-cyan/[0.03] blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-accent-blue/[0.03] blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Link href="/" className="flex items-center justify-center gap-3 mb-10 group">
          <div className="relative">
            <Shield className="w-10 h-10 text-accent-cyan" />
            <div className="absolute inset-0 bg-accent-cyan/20 blur-xl rounded-full" />
          </div>
          <span className="text-2xl font-bold">
            Bug<span className="text-gradient">Hunter</span> AI
          </span>
        </Link>

        <div className="glass-card-static p-8">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-severity-low/10 border border-severity-low/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-severity-low" />
              </div>
              <h2 className="text-xl font-bold mb-2">Check your email</h2>
              <p className="text-text-secondary text-sm mb-6">
                We sent a password reset link to{" "}
                <span className="font-medium text-text-primary">{email}</span>.
                Check your inbox and follow the link.
              </p>
              <Link href="/login" className="text-accent-cyan hover:underline text-sm font-medium">
                Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
                <p className="text-text-secondary text-sm">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-severity-critical/10 border border-severity-critical/20 mb-6"
                >
                  <AlertCircle className="w-5 h-5 text-severity-critical flex-shrink-0" />
                  <p className="text-sm text-severity-critical">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="input-field !pl-12"
                      required
                      id="forgot-email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Reset Link <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-sm text-text-secondary hover:text-accent-cyan transition-colors"
                >
                  ← Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
