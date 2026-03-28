import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Hash, Lock, Mail, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

type Step = "form" | "otp";

export default function SignupPage() {
  const { signup, login, navigate } = useApp();
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [otp, setOtp] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill all required fields");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPass) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep("otp");
    toast.success(`OTP sent to ${email}`);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = signup(name, email, password, referralCode || undefined);
    if (result.success) {
      login(email, password);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative py-8"
      style={{
        background:
          "linear-gradient(135deg, #070512 0%, #120A1E 50%, #1A1030 100%)",
      }}
    >
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-96 h-96 top-0 right-0 bg-ncx-pink opacity-15" />
        <div className="orb w-64 h-64 bottom-0 left-0 bg-ncx-cyan opacity-15" />
        <div className="dot-grid absolute inset-0 opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-4 relative z-10"
      >
        <div className="glass rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 mb-6"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-xl text-white"
                style={{
                  background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                }}
              >
                N
              </div>
              <span className="font-display font-bold text-xl text-white">
                NeoChainX
              </span>
            </button>
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              {step === "form" ? "Create Account" : "Verify Email"}
            </h1>
            <p className="text-muted-foreground">
              {step === "form"
                ? "Join 5000+ learners"
                : `Enter the 6-digit OTP sent to ${email}`}
            </p>
          </div>

          {step === "form" ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    data-ocid="signup.input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    data-ocid="signup.input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    data-ocid="signup.input"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="pl-10 pr-10 bg-white/5 border-white/15 text-white placeholder:text-white/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-muted-foreground"
                  >
                    {showPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    data-ocid="signup.input"
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Repeat password"
                    className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">
                  Referral Code (optional)
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    data-ocid="signup.input"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="Enter referral code"
                    className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/30"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                data-ocid="signup.submit_button"
                className="w-full rounded-full font-semibold text-white py-5"
                style={{
                  background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                }}
              >
                {loading ? "Processing..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-white/80">Enter OTP</Label>
                <Input
                  data-ocid="signup.input"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest bg-white/5 border-white/15 text-white placeholder:text-white/30"
                />
                <p className="text-xs text-muted-foreground text-center">
                  (Demo: enter any 6 digits)
                </p>
              </div>
              <Button
                type="submit"
                disabled={loading}
                data-ocid="signup.submit_button"
                className="w-full rounded-full font-semibold text-white py-5"
                style={{
                  background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                }}
              >
                {loading ? "Verifying..." : "Verify & Create Account"}
              </Button>
              <button
                type="button"
                onClick={() => setStep("form")}
                className="w-full text-center text-muted-foreground hover:text-white text-sm transition-colors"
              >
                ← Back to form
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                data-ocid="signup.login.link"
                className="text-ncx-cyan hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
