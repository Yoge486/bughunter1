"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Supabase puts the access token in the URL hash after redirect
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidSession(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2500);
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
        {/* Logo */}
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
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-severity-low/10 border border-severity-low/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-severity-low" />
              </div>
              <h2 className="text-xl font-bold mb-2">Password Updated</h2>
              <p className="text-text-secondary text-sm">
                Your password has been reset. Redirecting to sign in...
              </p>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Set New Password</h1>
                <p className="text-text-secondary text-sm">
                  Choose a strong password for your account.
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
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="input-field !pl-12"
                      required
                      minLength={6}
                      id="reset-password"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Re-enter your password"
                      className="input-field !pl-12"
                      required
                      id="reset-confirm"
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
                      Update Password <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-sm text-text-secondary hover:text-accent-cyan transition-colors">
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
