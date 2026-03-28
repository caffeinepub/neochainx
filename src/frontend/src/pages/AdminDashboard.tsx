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
import { Switch } from "@/components/ui/switch";
import {
  Activity,
  Ban,
  BookOpen,
  CheckCircle,
  ClipboardList,
  CreditCard,
  DollarSign,
  Eye,
  LayoutDashboard,
  LogOut,
  Percent,
  Plus,
  QrCode,
  Save,
  Settings,
  ShoppingBag,
  TrendingUp,
  Upload,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import type { Product, QRCode } from "../context/AppContext";

type AdminTab =
  | "overview"
  | "users"
  | "products"
  | "payments"
  | "tasks"
  | "referrals"
  | "qrcodes"
  | "activity"
  | "settings";

export default function AdminDashboard() {
  const {
    currentUser,
    logout,
    users,
    products,
    purchases,
    paymentOrders,
    tasks,
    taskSubmissions,
    walletTransactions,
    activityLogs,
    qrCodes,
    settings,
    approvePaymentOrder,
    rejectPaymentOrder,
    approveTaskSubmission,
    rejectTaskSubmission,
    updateProduct,
    updateUserBalance,
    banUser,
    createTask,
    updateSettings,
    updateQRCode,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [searchUsers, setSearchUsers] = useState("");
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(
    null,
  );
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceType, setBalanceType] = useState<"add" | "deduct">("add");
  const [rejectNote, setRejectNote] = useState("");
  const [rejectOrderId, setRejectOrderId] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    rewardAmount: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fmt = (paise: number) =>
    `₹${Math.abs(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const totalRevenue = purchases.reduce((s, p) => s + p.amount, 0);
  const totalUsers = users.filter((u) => u.role === "user").length;
  const pendingPayments = paymentOrders.filter(
    (o) => o.status === "pending",
  ).length;

  const filteredUsers = users.filter(
    (u) =>
      u.role === "user" &&
      (u.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
        u.email.toLowerCase().includes(searchUsers.toLowerCase()) ||
        u.id.toLowerCase().includes(searchUsers.toLowerCase())),
  );

  const handleApprovePayment = (orderId: string) => {
    approvePaymentOrder(orderId, "Payment verified and approved");
    toast.success("Payment approved!");
  };

  const handleRejectPayment = () => {
    if (!rejectOrderId) return;
    rejectPaymentOrder(
      rejectOrderId,
      rejectNote || "Payment rejected by admin",
    );
    setRejectOrderId("");
    setRejectNote("");
    toast.success("Payment rejected");
  };

  const handleUpdateBalance = () => {
    if (!selectedUser || !balanceAmount) {
      toast.error("Enter amount");
      return;
    }
    const amount = Number.parseFloat(balanceAmount) * 100;
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Invalid amount");
      return;
    }
    updateUserBalance(selectedUser.id, amount, balanceType);
    toast.success(
      `Balance ${balanceType === "add" ? "added" : "deducted"} successfully`,
    );
    setBalanceAmount("");
  };

  const handleSaveProduct = () => {
    if (!editProduct) return;
    updateProduct(editProduct);
    setEditProduct(null);
    toast.success("Product updated!");
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.rewardAmount) {
      toast.error("Fill all fields");
      return;
    }
    const reward = Number.parseFloat(newTask.rewardAmount) * 100;
    if (Number.isNaN(reward)) {
      toast.error("Invalid reward amount");
      return;
    }
    createTask(newTask.title, newTask.description, reward);
    setNewTask({ title: "", description: "", rewardAmount: "" });
    toast.success("Task created!");
  };

  const handleQRUpload = (qr: QRCode, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      updateQRCode({ ...qr, imageData: e.target?.result as string });
      toast.success(`QR code updated for ${qr.label}`);
    };
    reader.readAsDataURL(file);
  };

  const NAV_ITEMS: {
    id: AdminTab;
    icon: React.ElementType;
    label: string;
    badge?: number;
  }[] = [
    { id: "overview", icon: LayoutDashboard, label: "Overview" },
    { id: "users", icon: Users, label: "Users", badge: totalUsers },
    { id: "products", icon: BookOpen, label: "Products" },
    {
      id: "payments",
      icon: CreditCard,
      label: "Payments",
      badge: pendingPayments,
    },
    { id: "tasks", icon: ClipboardList, label: "Tasks" },
    { id: "referrals", icon: UserCheck, label: "Referrals" },
    { id: "qrcodes", icon: QrCode, label: "QR Codes" },
    { id: "activity", icon: Activity, label: "Activity Log" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

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
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
              }}
            >
              N
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm">
                NeoChainX
              </div>
              <div className="text-xs text-ncx-pink">Admin Panel</div>
            </div>
          </div>
        </div>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
              style={{
                background: "linear-gradient(135deg, #FF4FD8, #7A4DFF)",
              }}
            >
              {currentUser?.name[0]}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                {currentUser?.name}
              </div>
              <div className="text-xs text-ncx-pink">Administrator</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          {NAV_ITEMS.map(({ id, icon: Icon, label, badge }) => (
            <button
              type="button"
              key={id}
              onClick={() => {
                setActiveTab(id);
                setSidebarOpen(false);
              }}
              data-ocid={`admin.sidebar.${id}.link`}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? "text-white"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
              style={
                activeTab === id
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(255,79,216,0.2), rgba(122,77,255,0.2))",
                      border: "1px solid rgba(255,79,216,0.3)",
                    }
                  : {}
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {badge !== undefined && badge > 0 && (
                <Badge className="ml-auto text-xs h-5 min-w-[1.25rem] bg-ncx-pink text-white border-0">
                  {badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={logout}
            data-ocid="admin.logout.button"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-white"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-white"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>
          <h1 className="font-display text-lg font-bold text-white capitalize">
            {activeTab.replace(/([A-Z])/g, " $1")}
          </h1>
          <Badge className="bg-ncx-pink/20 text-ncx-pink border-ncx-pink/30">
            Admin
          </Badge>
        </header>

        <main className="p-6">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Revenue",
                    value: fmt(totalRevenue),
                    icon: DollarSign,
                    color: "#1FE3D0",
                    sub: `${purchases.length} sales`,
                  },
                  {
                    label: "Total Users",
                    value: totalUsers,
                    icon: Users,
                    color: "#7A4DFF",
                    sub: "Registered",
                  },
                  {
                    label: "Pending Payments",
                    value: pendingPayments,
                    icon: CreditCard,
                    color: "#F0C24B",
                    sub: "Awaiting review",
                  },
                  {
                    label: "Total Purchases",
                    value: purchases.length,
                    icon: ShoppingBag,
                    color: "#FF4FD8",
                    sub: "Completed orders",
                  },
                ].map(({ label, value, icon: Icon, color, sub }) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-5 border border-white/10"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${color}22` }}
                    >
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <div className="font-display text-2xl font-bold text-white mb-1">
                      {value}
                    </div>
                    <div className="text-sm text-white/80">{label}</div>
                    <div className="text-xs text-muted-foreground">{sub}</div>
                  </motion.div>
                ))}
              </div>

              {/* Revenue by product */}
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h2 className="font-display font-bold text-white mb-4">
                  Revenue by Product
                </h2>
                <div className="space-y-3">
                  {products.map((p) => {
                    const rev = purchases
                      .filter((pu) => pu.productId === p.id)
                      .reduce((s, pu) => s + pu.amount, 0);
                    const pct = totalRevenue ? (rev / totalRevenue) * 100 : 0;
                    return (
                      <div key={p.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">{p.title}</span>
                          <span className="text-ncx-cyan">{fmt(rev)}</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              background:
                                "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent activity */}
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h2 className="font-display font-bold text-white mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-2">
                  {activityLogs.slice(0, 10).map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 text-sm"
                    >
                      <div>
                        <span className="text-white font-medium">
                          {log.action}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          {log.details}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleTimeString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  data-ocid="admin.users.search_input"
                  value={searchUsers}
                  onChange={(e) => setSearchUsers(e.target.value)}
                  placeholder="Search by name, email or ID..."
                  className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                />
              </div>
              <div className="glass rounded-2xl overflow-hidden border border-white/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      {[
                        "User",
                        "ID",
                        "Approved",
                        "Pending",
                        "Status",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-muted-foreground font-medium"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, i) => (
                      <tr
                        key={u.id}
                        data-ocid={`admin.users.item.${i + 1}`}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-white">{u.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {u.email}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                          {u.id.substring(0, 8)}
                        </td>
                        <td className="px-4 py-3 text-ncx-cyan">
                          {fmt(u.approvedBalance)}
                        </td>
                        <td className="px-4 py-3 text-ncx-gold">
                          {fmt(u.pendingBalance)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={
                              u.isBanned
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : "bg-green-500/20 text-green-400 border-green-500/30"
                            }
                          >
                            {u.isBanned ? "Banned" : "Active"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedUser(u)}
                              data-ocid={`admin.users.edit.button.${i + 1}`}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-white"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                banUser(u.id, !u.isBanned);
                                toast.success(
                                  u.isBanned ? "User unbanned" : "User banned",
                                );
                              }}
                              data-ocid={`admin.users.ban.button.${i + 1}`}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400"
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div
                    data-ocid="admin.users.empty_state"
                    className="text-center py-8 text-muted-foreground"
                  >
                    No users found
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products */}
          {activeTab === "products" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {products.map((p, i) => (
                <div
                  key={p.id}
                  data-ocid={`admin.products.item.${i + 1}`}
                  className="glass rounded-2xl p-5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-bold text-white text-sm">
                      {p.title}
                    </h3>
                    <Switch
                      checked={p.isEnabled}
                      onCheckedChange={(v) => {
                        updateProduct({ ...p, isEnabled: v });
                        toast.success(`Product ${v ? "enabled" : "disabled"}`);
                      }}
                      data-ocid={`admin.products.switch.${i + 1}`}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-white/60 text-xs">
                          Price (₹)
                        </Label>
                        <div className="font-bold text-white">
                          {fmt(p.price)}
                        </div>
                      </div>
                      <div>
                        <Label className="text-white/60 text-xs">
                          Cashback %
                        </Label>
                        <div className="font-bold text-ncx-gold">
                          {p.cashbackPercent}%
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setEditProduct({ ...p })}
                      data-ocid={`admin.products.edit.button.${i + 1}`}
                      className="w-full rounded-full text-white"
                      style={{
                        background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                      }}
                    >
                      Edit Product
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Payments */}
          {activeTab === "payments" && (
            <div className="space-y-4">
              <div className="glass rounded-2xl overflow-hidden border border-white/10">
                <div className="px-4 py-3 border-b border-white/10">
                  <h2 className="font-display font-bold text-white">
                    Payment Orders
                  </h2>
                </div>
                {paymentOrders.length === 0 && (
                  <div
                    data-ocid="admin.payments.empty_state"
                    className="text-center py-8 text-muted-foreground"
                  >
                    No payment orders
                  </div>
                )}
                <div className="divide-y divide-white/5">
                  {paymentOrders.map((o, i) => {
                    const user = users.find((u) => u.id === o.userId);
                    const product = products.find((p) => p.id === o.productId);
                    return (
                      <div
                        key={o.id}
                        data-ocid={`admin.payments.item.${i + 1}`}
                        className="p-4 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-white">
                              {user?.name}{" "}
                              <span className="text-muted-foreground text-sm">
                                ({user?.email})
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {product?.title} • {fmt(o.amount)} •{" "}
                              {o.paymentMethod.toUpperCase()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(o.createdAt).toLocaleString("en-IN")}
                            </div>
                            {o.screenshotName && (
                              <div className="text-xs text-ncx-cyan mt-1">
                                📎 {o.screenshotName}
                              </div>
                            )}
                            {o.adminNote && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Note: {o.adminNote}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Badge
                              className={`${
                                o.status === "verified"
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : o.status === "rejected"
                                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              }`}
                            >
                              {o.status}
                            </Badge>
                            {o.status === "pending" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprovePayment(o.id)}
                                  data-ocid={`admin.payments.approve.button.${i + 1}`}
                                  className="h-8 rounded-full text-white bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />{" "}
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => setRejectOrderId(o.id)}
                                  data-ocid={`admin.payments.reject.button.${i + 1}`}
                                  variant="destructive"
                                  className="h-8 rounded-full"
                                >
                                  <XCircle className="w-3 h-3 mr-1" /> Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tasks */}
          {activeTab === "tasks" && (
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h2 className="font-display font-bold text-white mb-4">
                  Create New Task
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/80">Task Title</Label>
                    <Input
                      data-ocid="admin.tasks.title.input"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder="Task name"
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/80">Description</Label>
                    <Input
                      data-ocid="admin.tasks.desc.input"
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      placeholder="What users need to do"
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/80">Reward Amount (₹)</Label>
                    <Input
                      data-ocid="admin.tasks.reward.input"
                      value={newTask.rewardAmount}
                      onChange={(e) =>
                        setNewTask((p) => ({
                          ...p,
                          rewardAmount: e.target.value,
                        }))
                      }
                      placeholder="e.g. 100"
                      type="number"
                      className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreateTask}
                  data-ocid="admin.tasks.create.button"
                  className="mt-4 rounded-full text-white"
                  style={{
                    background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" /> Create Task
                </Button>
              </div>

              <div className="glass rounded-2xl p-6 border border-white/10">
                <h2 className="font-display font-bold text-white mb-4">
                  Task Submissions
                </h2>
                {taskSubmissions.length === 0 && (
                  <div
                    data-ocid="admin.tasks.empty_state"
                    className="text-center py-6 text-muted-foreground"
                  >
                    No submissions yet
                  </div>
                )}
                <div className="space-y-3">
                  {taskSubmissions.map((sub, i) => {
                    const task = tasks.find((t) => t.id === sub.taskId);
                    const user = users.find((u) => u.id === sub.userId);
                    return (
                      <div
                        key={sub.id}
                        data-ocid={`admin.tasks.item.${i + 1}`}
                        className="p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-white">
                              {user?.name}{" "}
                              <span className="text-muted-foreground text-sm">
                                — {task?.title}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Proof: {sub.proof}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(sub.createdAt).toLocaleString("en-IN")}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                sub.status === "approved"
                                  ? "bg-green-500/20 text-green-400"
                                  : sub.status === "rejected"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                              }
                            >
                              {sub.status}
                            </Badge>
                            {sub.status === "pending" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    approveTaskSubmission(sub.id);
                                    toast.success("Task approved!");
                                  }}
                                  data-ocid={`admin.tasks.approve.button.${i + 1}`}
                                  className="h-8 rounded-full text-white bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    rejectTaskSubmission(sub.id);
                                    toast.success("Task rejected");
                                  }}
                                  data-ocid={`admin.tasks.reject.button.${i + 1}`}
                                  variant="destructive"
                                  className="h-8 rounded-full"
                                >
                                  <XCircle className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Referrals */}
          {activeTab === "referrals" && (
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h2 className="font-display font-bold text-white mb-6">
                  Referral Settings
                </h2>
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">
                        Referral System
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Enable/disable the referral earning system
                      </div>
                    </div>
                    <Switch
                      data-ocid="admin.referrals.switch"
                      checked={settings.referralEnabled}
                      onCheckedChange={(v) => {
                        updateSettings({ referralEnabled: v });
                        toast.success(
                          `Referral system ${v ? "enabled" : "disabled"}`,
                        );
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label className="text-white/80">
                        Commission Percentage
                      </Label>
                      <div className="flex items-center gap-3 mt-2">
                        <Input
                          type="number"
                          value={settings.referralCommissionPercent}
                          onChange={(e) =>
                            updateSettings({
                              referralCommissionPercent:
                                Number.parseFloat(e.target.value) || 0,
                            })
                          }
                          data-ocid="admin.referrals.commission.input"
                          className="bg-white/5 border-white/15 text-white w-32"
                        />
                        <span className="text-muted-foreground">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h2 className="font-display font-bold text-white mb-4">
                  Referral Transactions
                </h2>
                {walletTransactions.filter((t) => t.txType === "REFERRAL")
                  .length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No referral transactions yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {walletTransactions
                      .filter((t) => t.txType === "REFERRAL")
                      .map((tx, i) => {
                        const u = users.find((u) => u.id === tx.userId);
                        return (
                          <div
                            key={tx.id}
                            data-ocid={`admin.referrals.item.${i + 1}`}
                            className="flex justify-between p-3 rounded-xl bg-white/5 text-sm"
                          >
                            <div>
                              <span className="text-white">{u?.name}</span>
                              <span className="text-muted-foreground ml-2">
                                {tx.description}
                              </span>
                            </div>
                            <span className="text-ncx-cyan font-bold">
                              {fmt(tx.amount)}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* QR Codes */}
          {activeTab === "qrcodes" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {qrCodes.map((qr, i) => (
                <div
                  key={qr.id}
                  data-ocid={`admin.qrcodes.item.${i + 1}`}
                  className="glass rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">{qr.label}</h3>
                    <Switch
                      checked={qr.isEnabled}
                      onCheckedChange={(v) =>
                        updateQRCode({ ...qr, isEnabled: v })
                      }
                      data-ocid={`admin.qrcodes.switch.${i + 1}`}
                    />
                  </div>
                  <div
                    className="w-32 h-32 mx-auto mb-4 rounded-xl border border-white/20 overflow-hidden flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(31,227,208,0.1), rgba(122,77,255,0.1))",
                    }}
                  >
                    {qr.imageData ? (
                      <img
                        src={qr.imageData}
                        alt={qr.label}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        <QrCode className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
                        <div className="text-xs text-muted-foreground">
                          No QR
                        </div>
                      </div>
                    )}
                  </div>
                  <label className="flex items-center justify-center gap-2 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleQRUpload(qr, f);
                      }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid={`admin.qrcodes.upload.button.${i + 1}`}
                      className="rounded-full border-white/20 text-white hover:bg-white/10 pointer-events-none"
                    >
                      <Upload className="w-3 h-3 mr-1" /> Upload QR
                    </Button>
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Activity Log */}
          {activeTab === "activity" && (
            <div className="glass rounded-2xl border border-white/10">
              <div className="px-4 py-3 border-b border-white/10">
                <h2 className="font-display font-bold text-white">
                  Activity Log
                </h2>
              </div>
              <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto scrollbar-thin">
                {activityLogs.length === 0 && (
                  <div
                    data-ocid="admin.activity.empty_state"
                    className="text-center py-8 text-muted-foreground"
                  >
                    No activity yet
                  </div>
                )}
                {activityLogs.map((log, i) => (
                  <div
                    key={log.id}
                    data-ocid={`admin.activity.item.${i + 1}`}
                    className="px-4 py-3 flex items-start justify-between hover:bg-white/5"
                  >
                    <div>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full mr-2"
                        style={{
                          background: "rgba(31,227,208,0.15)",
                          color: "#1FE3D0",
                        }}
                      >
                        {log.action}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {log.details}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-4 flex-shrink-0">
                      {new Date(log.createdAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl">
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h2 className="font-display font-bold text-white mb-4">
                  Product Cashback Settings
                </h2>
                <div className="space-y-4">
                  {products.map((p, i) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-medium text-white">
                          {p.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {fmt(p.price)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={p.cashbackPercent}
                          onChange={(e) =>
                            updateProduct({
                              ...p,
                              cashbackPercent:
                                Number.parseFloat(e.target.value) || 0,
                            })
                          }
                          data-ocid={`admin.settings.cashback.input.${i + 1}`}
                          className="w-20 bg-white/5 border-white/15 text-white text-center"
                        />
                        <Percent className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h2 className="font-display font-bold text-white mb-4">
                  Platform Info
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform</span>
                    <span className="text-white">NeoChainX</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Users</span>
                    <span className="text-ncx-cyan">{totalUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Revenue</span>
                    <span className="text-ncx-gold">{fmt(totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Referral Commission
                    </span>
                    <span className="text-ncx-pink">
                      {settings.referralCommissionPercent}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Sidebar overlay */}
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

      {/* User detail modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent
          className="glass border-white/10 text-white max-w-md"
          style={{ background: "#120A1E" }}
          data-ocid="admin.users.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-white">
              User Details
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl text-white"
                  style={{
                    background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                  }}
                >
                  {selectedUser.name[0]}
                </div>
                <div>
                  <div className="font-display font-bold text-white">
                    {selectedUser.name}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {selectedUser.email}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ID: {selectedUser.id.substring(0, 12)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="text-xs text-muted-foreground">
                    Approved Balance
                  </div>
                  <div className="font-bold text-ncx-cyan">
                    {fmt(selectedUser.approvedBalance)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <div className="text-xs text-muted-foreground">
                    Pending Balance
                  </div>
                  <div className="font-bold text-ncx-gold">
                    {fmt(selectedUser.pendingBalance)}
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Referral Code</span>
                  <Badge className="text-ncx-cyan border-ncx-cyan/30 bg-ncx-cyan/10">
                    {selectedUser.referralCode}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Referral Active</span>
                  <span
                    className={
                      selectedUser.referralUnlocked
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {selectedUser.referralUnlocked ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="text-white">
                    {new Date(selectedUser.createdAt).toLocaleDateString(
                      "en-IN",
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    className={
                      selectedUser.isBanned
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                    }
                  >
                    {selectedUser.isBanned ? "Banned" : "Active"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3 p-4 rounded-xl border border-white/10">
                <Label className="text-white/80 font-semibold">
                  Adjust Balance
                </Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBalanceType("add")}
                    data-ocid="admin.users.balance_type.toggle"
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      balanceType === "add"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-white/5 text-muted-foreground"
                    }`}
                  >
                    + Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setBalanceType("deduct")}
                    data-ocid="admin.users.balance_type.toggle"
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      balanceType === "deduct"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-white/5 text-muted-foreground"
                    }`}
                  >
                    - Deduct
                  </button>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={balanceAmount}
                    onChange={(e) => setBalanceAmount(e.target.value)}
                    data-ocid="admin.users.balance.input"
                    placeholder="Amount in ₹"
                    className="flex-1 bg-white/5 border-white/15 text-white placeholder:text-white/30"
                  />
                  <Button
                    onClick={handleUpdateBalance}
                    data-ocid="admin.users.balance.save_button"
                    className="rounded-full text-white"
                    style={{
                      background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                    }}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button
                variant={selectedUser.isBanned ? "outline" : "destructive"}
                onClick={() => {
                  banUser(selectedUser.id, !selectedUser.isBanned);
                  toast.success(
                    selectedUser.isBanned ? "User unbanned" : "User banned",
                  );
                  setSelectedUser(null);
                }}
                data-ocid="admin.users.ban.button"
                className="w-full rounded-full"
              >
                <Ban className="w-4 h-4 mr-2" />
                {selectedUser.isBanned ? "Unban User" : "Ban User"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
        <DialogContent
          className="glass border-white/10 text-white max-w-md"
          style={{ background: "#120A1E" }}
          data-ocid="admin.products.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-white">
              Edit Product
            </DialogTitle>
          </DialogHeader>
          {editProduct && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Price (₹)</Label>
                <Input
                  type="number"
                  value={editProduct.price / 100}
                  onChange={(e) =>
                    setEditProduct((p) =>
                      p
                        ? {
                            ...p,
                            price:
                              (Number.parseFloat(e.target.value) || 0) * 100,
                          }
                        : p,
                    )
                  }
                  data-ocid="admin.products.price.input"
                  className="bg-white/5 border-white/15 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Cashback %</Label>
                <Input
                  type="number"
                  value={editProduct.cashbackPercent}
                  onChange={(e) =>
                    setEditProduct((p) =>
                      p
                        ? {
                            ...p,
                            cashbackPercent:
                              Number.parseFloat(e.target.value) || 0,
                          }
                        : p,
                    )
                  }
                  data-ocid="admin.products.cashback.input"
                  className="bg-white/5 border-white/15 text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-white/80">Product Enabled</Label>
                <Switch
                  checked={editProduct.isEnabled}
                  onCheckedChange={(v) =>
                    setEditProduct((p) => (p ? { ...p, isEnabled: v } : p))
                  }
                  data-ocid="admin.products.enabled.switch"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setEditProduct(null)}
                  data-ocid="admin.products.cancel_button"
                  className="flex-1 rounded-full border-white/20 text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProduct}
                  data-ocid="admin.products.save_button"
                  className="flex-1 rounded-full text-white"
                  style={{
                    background: "linear-gradient(135deg, #1FE3D0, #7A4DFF)",
                  }}
                >
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Payment Modal */}
      <Dialog open={!!rejectOrderId} onOpenChange={() => setRejectOrderId("")}>
        <DialogContent
          className="glass border-white/10 text-white max-w-sm"
          style={{ background: "#120A1E" }}
          data-ocid="admin.payments.reject.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-white">
              Reject Payment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/80">Rejection Note (optional)</Label>
              <Input
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                data-ocid="admin.payments.reject.input"
                placeholder="Reason for rejection..."
                className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setRejectOrderId("")}
                data-ocid="admin.payments.reject.cancel_button"
                className="flex-1 rounded-full border-white/20 text-white"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectPayment}
                data-ocid="admin.payments.reject.confirm_button"
                className="flex-1 rounded-full"
              >
                Confirm Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
