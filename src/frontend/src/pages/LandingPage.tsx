import { Button } from "@/components/ui/button";
import {
  Award,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Gift,
  Shield,
  Star,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    role: "Software Engineer, Delhi",
    text: "NeoChainX completely transformed my understanding of personal finance. Within 3 months of following the blueprint, I increased my savings by 40%.",
    rating: 5,
  },
  {
    name: "Priya Shrestha",
    role: "Entrepreneur, Kathmandu",
    text: "The Digital Entrepreneurship Guide gave me the roadmap I needed. I launched my business and reached ₹50,000 in monthly revenue in just 4 months.",
    rating: 5,
  },
  {
    name: "Aditya Kumar",
    role: "Crypto Investor, Mumbai",
    text: "The Crypto & Web3 guide is outstanding. Clear, practical, and specifically tailored for Indian and Nepali markets. Absolutely worth every rupee.",
    rating: 5,
  },
];

const PAYMENT_METHODS = [
  { name: "UPI", color: "#7A4DFF" },
  { name: "PhonePe", color: "#5F259F" },
  { name: "GPay", color: "#1FE3D0" },
  { name: "Paytm", color: "#00B8E0" },
  { name: "eSewa", color: "#60BB46" },
  { name: "Khalti", color: "#5C2D91" },
  { name: "USDT", color: "#26A17B" },
];

export default function LandingPage() {
  const { navigate, products } = useApp();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const formatPrice = (paise: number) =>
    `₹${(paise / 100).toLocaleString("en-IN")}`;

  return (
    <div
      className="min-h-screen bg-ncx-navy relative overflow-x-hidden"
      style={{
        background:
          "linear-gradient(135deg, #070512 0%, #120A1E 50%, #1A1030 100%)",
      }}
    >
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb w-96 h-96 top-0 left-0 bg-ncx-purple opacity-20" />
        <div className="orb w-80 h-80 top-1/3 right-10 bg-ncx-cyan opacity-15" />
        <div className="orb w-64 h-64 bottom-1/4 left-1/4 bg-ncx-pink opacity-10" />
        <div className="dot-grid absolute inset-0 opacity-30" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-lg"
              style={{
                background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
              }}
            >
              N
            </div>
            <span className="font-display font-bold text-xl text-white">
              NeoChainX
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <button
              type="button"
              data-ocid="nav.link"
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-white transition-colors"
            >
              Products
            </button>
            <button
              type="button"
              data-ocid="nav.link"
              onClick={() =>
                document
                  .getElementById("why")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-white transition-colors"
            >
              Why Us
            </button>
            <button
              type="button"
              data-ocid="nav.link"
              onClick={() =>
                document
                  .getElementById("testimonials")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-white transition-colors"
            >
              Reviews
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              data-ocid="nav.login.button"
              className="text-white/70 hover:text-white"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/signup")}
              data-ocid="nav.get_started.button"
              className="rounded-full px-5 font-semibold text-ncx-navy"
              style={{
                background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                color: "#fff",
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-ncx-cyan mb-6">
            <Zap className="w-4 h-4" />
            <span>India & Nepal's #1 Knowledge Platform</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight text-white mb-6">
            Unlock Premium{" "}
            <span className="text-gradient-cyan">Digital Knowledge</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Transform your financial future with expert-curated digital books on
            finance, crypto, entrepreneurship, and investment — built for India
            & Nepal.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => navigate("/signup")}
              data-ocid="hero.get_started.button"
              size="lg"
              className="rounded-full px-8 font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
              }}
            >
              Start Learning <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-ocid="hero.explore.button"
              variant="outline"
              size="lg"
              className="rounded-full px-8 border-white/20 text-white hover:bg-white/10"
            >
              Explore Books
            </Button>
          </div>
          <div className="flex items-center gap-8 mt-10 text-sm">
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-white">
                5,000+
              </div>
              <div className="text-muted-foreground">Learners</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-white">
                4.9★
              </div>
              <div className="text-muted-foreground">Rating</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-white">
                20%
              </div>
              <div className="text-muted-foreground">Referral Bonus</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative animate-float">
            <div className="w-80 h-96 rounded-2xl glass border border-white/20 flex flex-col items-center justify-center p-8 glow-cyan relative overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(31,227,208,0.15), rgba(122,77,255,0.2))",
                }}
              />
              <div
                className="w-20 h-20 rounded-2xl mb-6 flex items-center justify-center font-display font-black text-4xl text-white relative z-10"
                style={{
                  background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                }}
              >
                N
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2 relative z-10">
                NeoChainX
              </h3>
              <p className="text-muted-foreground text-sm text-center mb-6 relative z-10">
                Premium Knowledge Platform
              </p>
              <div className="grid grid-cols-2 gap-3 w-full relative z-10">
                {[
                  { icon: BookOpen, label: "4 Books", color: "#1FE3D0" },
                  { icon: Gift, label: "Cashback", color: "#FF4FD8" },
                  { icon: Users, label: "Referrals", color: "#7A4DFF" },
                  { icon: Wallet, label: "Wallet", color: "#F0C24B" },
                ].map(({ icon: Icon, label, color }) => (
                  <div
                    key={label}
                    className="glass-light rounded-xl p-3 flex flex-col items-center gap-1"
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                    <span className="text-xs text-white/80">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 glass rounded-xl px-3 py-2 text-xs text-ncx-cyan font-semibold border border-ncx-cyan/30">
              Earn Cashback 💰
            </div>
            <div className="absolute -bottom-4 -left-4 glass rounded-xl px-3 py-2 text-xs text-ncx-pink font-semibold border border-ncx-pink/30">
              Refer & Earn 🎁
            </div>
          </div>
        </motion.div>
      </section>

      {/* Products Grid */}
      <section id="products" className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground text-lg">
            Premium knowledge books crafted for South Asian learners
          </p>
        </motion.div>
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          data-ocid="products.list"
        >
          {products
            .filter((p) => p.isEnabled)
            .map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-ocid={`products.item.${i + 1}`}
                className="glass rounded-2xl overflow-hidden group hover:border-white/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={product.cover}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 60%, rgba(7,5,18,0.9))",
                    }}
                  />
                  <div className="absolute top-3 right-3 glass rounded-full px-2 py-1 text-xs text-ncx-gold font-semibold">
                    {product.cashbackPercent}% Cashback
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-ncx-gold text-ncx-gold" />
                    <Star className="w-3 h-3 fill-ncx-gold text-ncx-gold" />
                    <Star className="w-3 h-3 fill-ncx-gold text-ncx-gold" />
                    <Star className="w-3 h-3 fill-ncx-gold text-ncx-gold" />
                    <Star className="w-3 h-3 fill-ncx-gold text-ncx-gold" />
                    <span className="text-xs text-muted-foreground ml-1">
                      ({product.reviews})
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-white text-sm mb-1 line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="text-xs text-muted-foreground mb-3">
                    by {product.author}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xl text-white">
                      {formatPrice(product.price)}
                    </span>
                    <Button
                      size="sm"
                      className="rounded-full text-xs px-4 text-white"
                      style={{
                        background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                      }}
                      data-ocid={`products.view_details.button.${i + 1}`}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Why NeoChainX */}
      <section id="why" className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Why NeoChainX?
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Shield,
              title: "Trusted Platform",
              desc: "Verified products and secure payment processing with full transparency.",
              color: "#1FE3D0",
            },
            {
              icon: TrendingUp,
              title: "Earn While You Learn",
              desc: "Get cashback on every purchase and referral commissions up to 20%.",
              color: "#7A4DFF",
            },
            {
              icon: Award,
              title: "Expert-Curated Content",
              desc: "Knowledge books created by industry experts specifically for Indian & Nepali markets.",
              color: "#F0C24B",
            },
            {
              icon: Users,
              title: "Community & Rewards",
              desc: "Join thousands of learners and earn rewards for completing tasks and referring friends.",
              color: "#FF4FD8",
            },
          ].map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center hover:border-white/20 transition-all"
            >
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{
                  background: `${color}22`,
                  border: `1px solid ${color}44`,
                }}
              >
                <Icon className="w-7 h-7" style={{ color }} />
              </div>
              <h3 className="font-display font-bold text-white mb-2">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Testimonials
          </h2>
          <p className="text-muted-foreground">
            What our learners say about NeoChainX
          </p>
        </motion.div>
        <div className="max-w-2xl mx-auto">
          <motion.div
            key={activeTestimonial}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8 text-center"
          >
            <div className="flex justify-center gap-1 mb-4">
              <Star className="w-5 h-5 fill-ncx-gold text-ncx-gold" />
              <Star className="w-5 h-5 fill-ncx-gold text-ncx-gold" />
              <Star className="w-5 h-5 fill-ncx-gold text-ncx-gold" />
              <Star className="w-5 h-5 fill-ncx-gold text-ncx-gold" />
              <Star className="w-5 h-5 fill-ncx-gold text-ncx-gold" />
            </div>
            <p className="text-white/90 text-lg italic mb-6">
              "{TESTIMONIALS[activeTestimonial].text}"
            </p>
            <div
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
              }}
            >
              {TESTIMONIALS[activeTestimonial].name[0]}
            </div>
            <div className="font-semibold text-white">
              {TESTIMONIALS[activeTestimonial].name}
            </div>
            <div className="text-muted-foreground text-sm">
              {TESTIMONIALS[activeTestimonial].role}
            </div>
          </motion.div>
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((t, i) => (
              <button
                type="button"
                key={t.name}
                onClick={() => setActiveTestimonial(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === activeTestimonial ? "w-8 bg-ncx-cyan" : "bg-white/30"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold"
                  style={{
                    background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                  }}
                >
                  N
                </div>
                <span className="font-display font-bold text-white">
                  NeoChainX
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                India & Nepal's trusted platform for premium digital knowledge
                products.
              </p>
            </div>
            {[
              {
                title: "Platform",
                links: ["Products", "Wallet", "Referrals", "Tasks"],
              },
              {
                title: "Support",
                links: [
                  "Help Center",
                  "Contact Us",
                  "Privacy Policy",
                  "Terms of Service",
                ],
              },
              {
                title: "Legal",
                links: [
                  "Terms & Conditions",
                  "Privacy Policy",
                  "Refund Policy",
                  "Disclaimer",
                ],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-semibold text-white mb-4">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-white text-sm transition-colors"
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-muted-foreground text-sm">
                © {new Date().getFullYear()}. Built with ❤️ using{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ncx-cyan hover:underline"
                >
                  caffeine.ai
                </a>
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {PAYMENT_METHODS.map(({ name, color }) => (
                  <span
                    key={name}
                    className="text-xs font-semibold px-3 py-1 rounded-full border"
                    style={{
                      color,
                      borderColor: `${color}44`,
                      background: `${color}11`,
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
