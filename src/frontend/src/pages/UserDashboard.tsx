import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  Bell,
  BookOpen,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Clock,
  Copy,
  Gift,
  LayoutDashboard,
  Lock,
  LogOut,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import type { Product } from "../context/AppContext";

type DashTab =
  | "overview"
  | "products"
  | "purchases"
  | "wallet"
  | "referrals"
  | "tasks"
  | "notifications";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI / Google Pay / PhonePe", flag: "🇮🇳" },
  { id: "paytm", label: "Paytm", flag: "🇮🇳" },
  { id: "esewa", label: "eSewa", flag: "🇳🇵" },
  { id: "khalti", label: "Khalti", flag: "🇳🇵" },
  { id: "usdt", label: "USDT (Bybit Pay)", flag: "🌐" },
];

export default function UserDashboard() {
  const {
    currentUser,
    logout,
    navigate,
    products,
    purchases,
    paymentOrders,
    walletTransactions,
    taskSubmissions,
    tasks,
    notifications,
    createPaymentOrder,
    submitTask,
    markNotificationRead,
    qrCodes,
  } = useApp();

  const [activeTab, setActiveTab] = useState<DashTab>("overview");
  const [paymentModal, setPaymentModal] = useState<Product | null>(null);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [screenshotName, setScreenshotName] = useState("");
  const [bookModal, setBookModal] = useState<Product | null>(null);
  const [taskProofs, setTaskProofs] = useState<Record<string, string>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = currentUser!;
  const myPurchases = purchases.filter(
    (p) => p.userId === user.id && p.status === "completed",
  );
  const myOrders = paymentOrders.filter((o) => o.userId === user.id);
  const myTxns = walletTransactions.filter((t) => t.userId === user.id);
  const myNotifs = notifications.filter((n) => n.userId === user.id);
  const unreadCount = myNotifs.filter((n) => !n.isRead).length;
  const mySubmissions = taskSubmissions.filter((s) => s.userId === user.id);
  const purchasedProductIds = new Set(myPurchases.map((p) => p.productId));

  const fmt = (paise: number) =>
    `₹${Math.abs(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleBuy = (product: Product) => {
    if (purchasedProductIds.has(product.id)) {
      toast.info("You already own this product");
      return;
    }
    const pendingOrder = myOrders.find(
      (o) => o.productId === product.id && o.status === "pending",
    );
    if (pendingOrder) {
      toast.info("Payment already under review for this product");
      return;
    }
    setPaymentModal(product);
    setSelectedMethod("");
    setScreenshotName("");
  };

  const handlePaymentSubmit = () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (!screenshotName) {
      toast.error("Please upload payment screenshot");
      return;
    }
    createPaymentOrder(paymentModal!.id, selectedMethod, screenshotName);
    setPaymentModal(null);
    toast.success("Payment submitted! Under review.");
  };

  const handleTaskSubmit = (taskId: string) => {
    const proof = taskProofs[taskId];
    if (!proof?.trim()) {
      toast.error("Please enter your proof");
      return;
    }
    const existing = mySubmissions.find((s) => s.taskId === taskId);
    if (existing) {
      toast.info("Already submitted this task");
      return;
    }
    submitTask(taskId, proof);
    toast.success("Task submitted for review!");
    setTaskProofs((prev) => ({ ...prev, [taskId]: "" }));
  };

  const NAV_ITEMS: { id: DashTab; icon: React.ElementType; label: string }[] = [
    { id: "overview", icon: LayoutDashboard, label: "Dashboard" },
    { id: "products", icon: BookOpen, label: "Products" },
    { id: "purchases", icon: ShoppingBag, label: "My Purchases" },
    { id: "wallet", icon: Wallet, label: "Wallet" },
    { id: "referrals", icon: Users, label: "Referrals" },
    { id: "tasks", icon: ClipboardList, label: "Tasks" },
    { id: "notifications", icon: Bell, label: "Notifications" },
  ];

  const getQR = (method: string) =>
    qrCodes.find((q) => q.method === method.split(" ")[0].toLowerCase());

  return (
    <div
      className="min-h-screen flex"
      style={{
        background:
          "linear-gradient(135deg, #070512 0%, #120A1E 50%, #1A1030 100%)",
      }}
    >
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-40 w-64 flex flex-col glass border-r border-white/10 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
              }}
            >
              N
            </div>
            <span className="font-display font-bold text-white">NeoChainX</span>
          </button>
        </div>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
              }}
            >
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold text-white truncate max-w-[130px]">
                {user.name}
              </div>
              <div className="text-xs text-muted-foreground truncate max-w-[130px]">
                {user.email}
              </div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
            <button
              type="button"
              key={id}
              onClick={() => {
                setActiveTab(id);
                setSidebarOpen(false);
              }}
              data-ocid={`sidebar.${id}.link`}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? "text-white"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
              style={
                activeTab === id
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(31,227,208,0.2), rgba(122,77,255,0.2))",
                      border: "1px solid rgba(31,227,208,0.3)",
                    }
                  : {}
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {id === "notifications" && unreadCount > 0 && (
                <Badge className="ml-auto text-xs h-5 min-w-[1.25rem] flex items-center justify-center bg-ncx-pink text-white border-0">
                  {unreadCount}
                </Badge>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={logout}
            data-ocid="sidebar.logout.button"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-white hover:bg-white/5"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-white"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg font-bold text-white capitalize">
            {activeTab}
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className="relative p-2 text-muted-foreground hover:text-white"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-ncx-pink" />
              )}
            </button>
            <div className="text-sm text-muted-foreground hidden md:block">
              ID: {user.id.substring(0, 8).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Approved Balance",
                    value: fmt(user.approvedBalance),
                    icon: Wallet,
                    color: "#1FE3D0",
                    sub: "Available to use",
                  },
                  {
                    label: "Pending Balance",
                    value: fmt(user.pendingBalance),
                    icon: Clock,
                    color: "#F0C24B",
                    sub: "Awaiting tasks",
                  },
                  {
                    label: "Total Purchases",
                    value: myPurchases.length,
                    icon: ShoppingBag,
                    color: "#7A4DFF",
                    sub: "Products owned",
                  },
                  {
                    label: "Referral Status",
                    value: user.referralUnlocked ? "Active" : "Locked",
                    icon: user.referralUnlocked ? CheckCircle : Lock,
                    color: user.referralUnlocked ? "#1FE3D0" : "#FF4FD8",
                    sub: user.referralUnlocked
                      ? "Earn 20% commission"
                      : "Purchase to unlock",
                  },
                ].map(({ label, value, icon: Icon, color, sub }) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-5 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${color}22` }}
                      >
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                    </div>
                    <div className="font-display text-2xl font-bold text-white mb-1">
                      {value}
                    </div>
                    <div className="text-sm text-white/80 font-medium">
                      {label}
                    </div>
                    <div className="text-xs text-muted-foreground">{sub}</div>
                  </motion.div>
                ))}
              </div>

              {/* Recent activity */}
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h2 className="font-display font-bold text-white mb-4">
                  Recent Purchases
                </h2>
                {myPurchases.length === 0 ? (
                  <div
                    data-ocid="purchases.empty_state"
                    className="text-center py-8 text-muted-foreground"
                  >
                    <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>No purchases yet.</p>
                    <Button
                      onClick={() => setActiveTab("products")}
                      className="mt-4 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                        color: "#fff",
                      }}
                    >
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myPurchases.slice(0, 3).map((p) => {
                      const prod = products.find((pr) => pr.id === p.productId);
                      return (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                        >
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {prod?.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(p.createdAt).toLocaleDateString(
                                "en-IN",
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">
                              {fmt(p.amount)}
                            </div>
                            <div className="text-xs text-ncx-cyan">
                              +{fmt(p.cashbackAmount)} cashback
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products */}
          {activeTab === "products" && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-6">
              {products
                .filter((p) => p.isEnabled)
                .map((product, i) => {
                  const owned = purchasedProductIds.has(product.id);
                  const pendingOrder = myOrders.find(
                    (o) => o.productId === product.id && o.status === "pending",
                  );
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      data-ocid={`products.item.${i + 1}`}
                      className="glass rounded-2xl overflow-hidden border border-white/10"
                    >
                      <div className="h-40 relative overflow-hidden">
                        <img
                          src={product.cover}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to right, rgba(7,5,18,0.8), transparent)",
                          }}
                        />
                        {owned && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1 text-xs text-green-400">
                            <CheckCircle className="w-3 h-3" /> Owned
                          </div>
                        )}
                        {pendingOrder && !owned && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1 text-xs text-yellow-400">
                            <Clock className="w-3 h-3" /> Under Review
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-display font-bold text-white text-lg">
                            {product.title}
                          </h3>
                          <div className="text-right">
                            <div className="font-display font-bold text-xl text-white">
                              {fmt(product.price)}
                            </div>
                            <div className="text-xs text-ncx-gold">
                              {product.cashbackPercent}% cashback
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">
                          {product.description}
                        </p>
                        <div className="mb-4">
                          <div className="text-xs font-semibold text-white/60 mb-2">
                            WHAT YOU GET:
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {product.benefits.slice(0, 4).map((b) => (
                              <div
                                key={b}
                                className="flex items-center gap-1 text-xs text-muted-foreground"
                              >
                                <CheckCircle className="w-3 h-3 text-ncx-cyan flex-shrink-0" />
                                {b}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          {owned ? (
                            <Button
                              onClick={() => setBookModal(product)}
                              data-ocid={`products.view.button.${i + 1}`}
                              className="flex-1 rounded-full text-white"
                              style={{
                                background:
                                  "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                              }}
                            >
                              <BookOpen className="w-4 h-4 mr-2" /> Read Now
                            </Button>
                          ) : (
                            <>
                              <Button
                                onClick={() => handleBuy(product)}
                                disabled={!!pendingOrder}
                                data-ocid={`products.buy.button.${i + 1}`}
                                className="flex-1 rounded-full text-white"
                                style={{
                                  background: pendingOrder
                                    ? undefined
                                    : "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                                }}
                              >
                                {pendingOrder ? "Under Review" : "Buy Now"}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setBookModal(product)}
                                data-ocid={`products.preview.button.${i + 1}`}
                                className="rounded-full border-white/20 text-white hover:bg-white/10"
                              >
                                <Lock className="w-4 h-4 mr-1" /> Preview
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}

          {/* My Purchases */}
          {activeTab === "purchases" && (
            <div className="space-y-4">
              {myPurchases.length === 0 && (
                <div
                  data-ocid="mypurchases.empty_state"
                  className="glass rounded-2xl p-12 text-center border border-white/10"
                >
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    No Purchases Yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Browse our products and make your first purchase.
                  </p>
                  <Button
                    onClick={() => setActiveTab("products")}
                    className="rounded-full text-white"
                    style={{
                      background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                    }}
                  >
                    Browse Products
                  </Button>
                </div>
              )}
              {myPurchases.map((p, i) => {
                const prod = products.find((pr) => pr.id === p.productId);
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    data-ocid={`purchases.item.${i + 1}`}
                    className="glass rounded-2xl p-5 border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={prod?.cover}
                        alt={prod?.title}
                        className="w-16 h-20 object-cover rounded-xl"
                      />
                      <div>
                        <h3 className="font-display font-bold text-white mb-1">
                          {prod?.title}
                        </h3>
                        <div className="text-sm text-muted-foreground">
                          {new Date(p.createdAt).toLocaleDateString("en-IN")}
                        </div>
                        <div className="text-xs text-ncx-cyan mt-1">
                          Cashback: {fmt(p.cashbackAmount)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white mb-2">
                        {fmt(p.amount)}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => prod && setBookModal(prod)}
                        data-ocid={`purchases.read.button.${i + 1}`}
                        className="rounded-full text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                        }}
                      >
                        Read Now
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
              {/* Pending orders */}
              {myOrders
                .filter(
                  (o) => o.status === "pending" || o.status === "rejected",
                )
                .map((o, i) => {
                  const prod = products.find((pr) => pr.id === o.productId);
                  return (
                    <div
                      key={o.id}
                      data-ocid={`orders.item.${i + 1}`}
                      className="glass rounded-2xl p-5 border border-white/10 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-display font-bold text-white mb-1">
                          {prod?.title}
                        </h3>
                        <div className="text-sm text-muted-foreground">
                          Via {o.paymentMethod.toUpperCase()} •{" "}
                          {new Date(o.createdAt).toLocaleDateString("en-IN")}
                        </div>
                        {o.adminNote && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Note: {o.adminNote}
                          </div>
                        )}
                      </div>
                      <Badge
                        className={
                          o.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }
                      >
                        {o.status === "pending" ? "Under Review" : "Rejected"}
                      </Badge>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Wallet */}
          {activeTab === "wallet" && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div
                  className="glass rounded-2xl p-6 border border-white/10"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(31,227,208,0.1), rgba(122,77,255,0.1))",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-ncx-cyan" />
                    <span className="text-white/80 font-medium">
                      Approved Balance
                    </span>
                  </div>
                  <div className="font-display text-4xl font-bold text-white">
                    {fmt(user.approvedBalance)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Available • Unlocked by admin after task approval
                  </p>
                </div>
                <div className="glass rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-ncx-gold" />
                    <span className="text-white/80 font-medium">
                      Pending Balance
                    </span>
                  </div>
                  <div className="font-display text-4xl font-bold text-white">
                    {fmt(user.pendingBalance)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Locked • Complete tasks to unlock
                  </p>
                </div>
              </div>
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h2 className="font-display font-bold text-white mb-4">
                  Transaction History
                </h2>
                {myTxns.length === 0 ? (
                  <div
                    data-ocid="wallet.empty_state"
                    className="text-center py-8 text-muted-foreground"
                  >
                    <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>No transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myTxns.map((tx, i) => (
                      <div
                        key={tx.id}
                        data-ocid={`wallet.item.${i + 1}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {tx.description}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(tx.createdAt).toLocaleDateString("en-IN")}{" "}
                            • {tx.txType}
                          </div>
                        </div>
                        <div
                          className={`font-bold ${tx.amount >= 0 ? "text-ncx-cyan" : "text-red-400"}`}
                        >
                          {tx.amount >= 0 ? "+" : ""}
                          {fmt(tx.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Referrals */}
          {activeTab === "referrals" && (
            <div>
              {!user.referralUnlocked ? (
                <div
                  data-ocid="referrals.locked.panel"
                  className="glass rounded-2xl p-12 text-center border border-ncx-pink/30"
                >
                  <Lock className="w-16 h-16 mx-auto mb-4 text-ncx-pink" />
                  <h2 className="font-display text-2xl font-bold text-white mb-3">
                    🔒 Referral System Locked
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Purchase any product to unlock your referral system and
                    start earning 20% commission on every successful referral.
                  </p>
                  <Button
                    onClick={() => setActiveTab("products")}
                    className="rounded-full text-white"
                    style={{
                      background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                    }}
                  >
                    Browse Products <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="glass rounded-2xl p-6 border border-white/10">
                    <h2 className="font-display font-bold text-white mb-4">
                      Your Referral Link
                    </h2>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                      <code className="flex-1 text-ncx-cyan text-sm truncate">
                        https://neochainx.com/signup?ref={user.referralCode}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://neochainx.com/signup?ref=${user.referralCode}`,
                          );
                          toast.success("Copied!");
                        }}
                        data-ocid="referrals.copy.button"
                      >
                        <Copy className="w-4 h-4 text-ncx-cyan" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-muted-foreground text-sm">
                        Your code:
                      </span>
                      <Badge className="text-ncx-cyan border-ncx-cyan/30 bg-ncx-cyan/10">
                        {user.referralCode}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      {
                        label: "Commission Rate",
                        value: "20%",
                        color: "#1FE3D0",
                      },
                      {
                        label: "Total Earnings",
                        value: fmt(
                          walletTransactions
                            .filter(
                              (t) =>
                                t.userId === user.id && t.txType === "REFERRAL",
                            )
                            .reduce((s, t) => s + t.amount, 0),
                        ),
                        color: "#F0C24B",
                      },
                      {
                        label: "Referral Code",
                        value: user.referralCode,
                        color: "#7A4DFF",
                      },
                    ].map(({ label, value, color }) => (
                      <div
                        key={label}
                        className="glass rounded-2xl p-5 border border-white/10 text-center"
                      >
                        <div
                          className="font-display text-2xl font-bold mb-1"
                          style={{ color }}
                        >
                          {value}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="glass rounded-2xl p-5 border border-white/10">
                    <h3 className="font-display font-bold text-white mb-3">
                      How It Works
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Share your unique referral link with friends",
                        "They sign up using your link",
                        "When they purchase any product, you earn 20% commission",
                        "Commission is credited to your pending balance",
                      ].map((step, i) => (
                        <div key={step} className="flex items-start gap-3">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                            }}
                          >
                            {i + 1}
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tasks */}
          {activeTab === "tasks" && (
            <div className="space-y-4">
              {tasks
                .filter((t) => t.isActive)
                .map((task, i) => {
                  const sub = mySubmissions.find((s) => s.taskId === task.id);
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      data-ocid={`tasks.item.${i + 1}`}
                      className="glass rounded-2xl p-6 border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-display font-bold text-white">
                            {task.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mt-1">
                            {task.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-ncx-gold">
                            {fmt(task.rewardAmount)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Reward
                          </div>
                        </div>
                      </div>
                      {sub ? (
                        <div
                          className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl ${
                            sub.status === "approved"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : sub.status === "rejected"
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          }`}
                        >
                          {sub.status === "approved" ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : sub.status === "rejected" ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                          {sub.status === "approved"
                            ? "Approved - Reward Credited!"
                            : sub.status === "rejected"
                              ? "Rejected"
                              : "Submitted - Under Review"}
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <Input
                            data-ocid={`tasks.input.${i + 1}`}
                            value={taskProofs[task.id] || ""}
                            onChange={(e) =>
                              setTaskProofs((prev) => ({
                                ...prev,
                                [task.id]: e.target.value,
                              }))
                            }
                            placeholder="Submit your proof here..."
                            className="flex-1 bg-white/5 border-white/15 text-white placeholder:text-white/30"
                          />
                          <Button
                            onClick={() => handleTaskSubmit(task.id)}
                            data-ocid={`tasks.submit.button.${i + 1}`}
                            className="rounded-full text-white"
                            style={{
                              background:
                                "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                            }}
                          >
                            Submit
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-3">
              {myNotifs.length === 0 && (
                <div
                  data-ocid="notifications.empty_state"
                  className="glass rounded-2xl p-12 text-center border border-white/10"
                >
                  <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    No Notifications
                  </h3>
                  <p className="text-muted-foreground">
                    You'll see notifications here when actions happen.
                  </p>
                </div>
              )}
              {myNotifs.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  data-ocid={`notifications.item.${i + 1}`}
                  onClick={() => markNotificationRead(n.id)}
                  className={`glass rounded-2xl p-4 border cursor-pointer transition-all ${
                    n.isRead
                      ? "border-white/5 opacity-60"
                      : "border-ncx-cyan/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-white">{n.message}</p>
                    {!n.isRead && (
                      <div className="w-2 h-2 rounded-full bg-ncx-cyan flex-shrink-0 mt-1 ml-2" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(n.createdAt).toLocaleString("en-IN")}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
        />
      )}

      {/* Payment Modal */}
      <Dialog open={!!paymentModal} onOpenChange={() => setPaymentModal(null)}>
        <DialogContent
          className="glass border-white/10 text-white max-w-md"
          data-ocid="payment.dialog"
          style={{ background: "#120A1E" }}
        >
          <DialogHeader>
            <DialogTitle className="font-display text-white">
              Complete Payment
            </DialogTitle>
          </DialogHeader>
          {paymentModal && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-sm text-muted-foreground">Product</div>
                <div className="font-semibold text-white">
                  {paymentModal.title}
                </div>
                <div className="font-display text-2xl font-bold text-white mt-1">
                  {fmt(paymentModal.price)}
                </div>
                <div className="text-xs text-ncx-gold">
                  {paymentModal.cashbackPercent}% cashback after approval
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Select Payment Method</Label>
                <div className="grid grid-cols-1 gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      data-ocid="payment.method.toggle"
                      className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-all text-left ${
                        selectedMethod === m.id
                          ? "border-ncx-cyan/50 bg-ncx-cyan/10 text-white"
                          : "border-white/10 text-muted-foreground hover:border-white/20"
                      }`}
                    >
                      <span>{m.flag}</span>
                      <span>{m.label}</span>
                      {selectedMethod === m.id && (
                        <CheckCircle className="w-4 h-4 text-ncx-cyan ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {selectedMethod &&
                (() => {
                  const qr = getQR(selectedMethod);
                  return (
                    <div className="text-center">
                      <Label className="text-white/80 block mb-2">
                        Scan QR to Pay
                      </Label>
                      {qr?.imageData ? (
                        <img
                          src={qr.imageData}
                          alt="QR Code"
                          className="w-40 h-40 mx-auto rounded-xl border border-white/20"
                        />
                      ) : (
                        <div
                          className="w-40 h-40 mx-auto rounded-xl border border-white/20 flex items-center justify-center"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(31,227,208,0.2), rgba(122,77,255,0.2))",
                          }}
                        >
                          <div className="text-center">
                            <div className="font-display text-ncx-cyan font-bold text-lg">
                              {selectedMethod.toUpperCase()}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              QR Coming Soon
                            </div>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Send exact amount and upload screenshot below
                      </p>
                    </div>
                  );
                })()}

              <div className="space-y-2">
                <Label className="text-white/80">
                  Upload Payment Screenshot
                </Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setScreenshotName(e.target.files?.[0]?.name || "")
                  }
                  data-ocid="payment.upload_button"
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-ncx-cyan/20 file:text-ncx-cyan cursor-pointer"
                />
                {screenshotName && (
                  <p className="text-xs text-ncx-cyan">✓ {screenshotName}</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setPaymentModal(null)}
                  data-ocid="payment.cancel_button"
                  className="flex-1 rounded-full border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePaymentSubmit}
                  data-ocid="payment.submit_button"
                  className="flex-1 rounded-full text-white"
                  style={{
                    background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                  }}
                >
                  Submit Payment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Book Preview Modal */}
      <Dialog open={!!bookModal} onOpenChange={() => setBookModal(null)}>
        <DialogContent
          className="glass border-white/10 text-white max-w-2xl"
          data-ocid="book.dialog"
          style={{ background: "#120A1E" }}
        >
          <DialogHeader>
            <DialogTitle className="font-display text-white">
              {bookModal?.title}
            </DialogTitle>
          </DialogHeader>
          {bookModal && (
            <div className="space-y-5">
              {purchasedProductIds.has(bookModal.id) ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-ncx-cyan text-sm">
                    <CheckCircle className="w-4 h-4" /> Full access unlocked
                  </div>
                  <div className="space-y-3">
                    {[
                      "Introduction",
                      "Chapter 1: Foundations",
                      "Chapter 2: Strategy",
                      "Chapter 3: Implementation",
                      "Chapter 4: Advanced Techniques",
                      "Chapter 5: Case Studies",
                      "Conclusion & Action Plan",
                    ].map((ch, i) => (
                      <div
                        key={ch}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-all"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                          style={{
                            background:
                              "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                          }}
                        >
                          {i + 1}
                        </div>
                        <span className="text-sm text-white">{ch}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lock className="w-16 h-16 mx-auto mb-4 text-ncx-pink" />
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    Content Locked
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    {bookModal.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-6 text-left">
                    {bookModal.benefits.map((b) => (
                      <div
                        key={b}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle className="w-3 h-3 text-ncx-cyan" />
                        {b}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 justify-center text-muted-foreground text-sm mb-4">
                    <AlertTriangle className="w-4 h-4 text-ncx-gold" />
                    Purchase to unlock full access + {bookModal.cashbackPercent}
                    % cashback
                  </div>
                  <Button
                    onClick={() => {
                      setBookModal(null);
                      handleBuy(bookModal);
                    }}
                    data-ocid="book.buy.button"
                    className="rounded-full text-white"
                    style={{
                      background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                    }}
                  >
                    Buy Now — {fmt(bookModal.price)}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
