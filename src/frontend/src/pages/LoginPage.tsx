import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

export default function LoginPage() {
  const { login, navigate } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success("Welcome back!");
      // Navigate based on role handled in App.tsx
      navigate("/dashboard");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        background:
          "linear-gradient(135deg, #070512 0%, #120A1E 50%, #1A1030 100%)",
      }}
    >
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-96 h-96 top-0 left-0 bg-ncx-purple opacity-20" />
        <div className="orb w-64 h-64 bottom-0 right-0 bg-ncx-cyan opacity-15" />
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
              Welcome Back
            </h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-white/80">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  data-ocid="login.input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/30"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  data-ocid="login.input"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-white/5 border-white/15 text-white placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-white"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              data-ocid="login.submit_button"
              className="w-full rounded-full font-semibold text-white py-5"
              style={{
                background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                data-ocid="login.signup.link"
                className="text-ncx-cyan hover:underline font-medium"
              >
                Sign up free
              </button>
            </p>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-muted-foreground text-center">
              Admin: admin@neochainx.com / Sandeep@321
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
