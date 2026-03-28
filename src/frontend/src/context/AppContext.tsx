import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  pendingBalance: number;
  approvedBalance: number;
  referralCode: string;
  referralUnlocked: boolean;
  referredBy?: string;
  isBanned: boolean;
  createdAt: number;
  loginHistory?: string[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  price: number;
  cashbackPercent: number;
  isEnabled: boolean;
  author: string;
  rating: number;
  reviews: number;
  cover: string;
}

export interface Purchase {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  cashbackAmount: number;
  status: "pending" | "completed";
  paymentMethod: string;
  createdAt: number;
}

export interface PaymentOrder {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  paymentMethod: string;
  screenshotName: string;
  status: "pending" | "verified" | "rejected";
  adminNote: string;
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  rewardAmount: number;
  isActive: boolean;
}

export interface TaskSubmission {
  id: string;
  userId: string;
  taskId: string;
  proof: string;
  status: "pending" | "approved" | "rejected";
  createdAt: number;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: number;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  txType: string;
  description: string;
  createdAt: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  userId: string;
  details: string;
  createdAt: number;
}

export interface QRCode {
  id: string;
  method: string;
  label: string;
  imageData: string;
  isEnabled: boolean;
}

export interface AppSettings {
  referralEnabled: boolean;
  referralCommissionPercent: number;
}

const generateId = () =>
  Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod1",
    title: "Financial Mastery Blueprint",
    description:
      "Master personal finance, investments, and wealth building strategies for Indian and Nepali markets.",
    benefits: [
      "Budgeting & savings framework",
      "Stock market basics for beginners",
      "Mutual funds & SIP strategies",
      "Tax planning for India & Nepal",
      "Emergency fund setup",
      "Debt elimination roadmap",
    ],
    price: 150000,
    cashbackPercent: 10,
    isEnabled: true,
    author: "Rajesh Sharma",
    rating: 4.8,
    reviews: 234,
    cover: "/assets/generated/book-financial-mastery.dim_300x400.jpg",
  },
  {
    id: "prod2",
    title: "Digital Entrepreneurship Guide",
    description:
      "Complete roadmap to building a profitable online business from scratch in South Asia.",
    benefits: [
      "Business idea validation",
      "Building your brand online",
      "Social media marketing mastery",
      "Revenue model frameworks",
      "Scaling from 0 to ₹1L/month",
      "Case studies from India & Nepal",
    ],
    price: 300000,
    cashbackPercent: 10,
    isEnabled: true,
    author: "Priya Nair",
    rating: 4.9,
    reviews: 187,
    cover: "/assets/generated/book-digital-entrepreneur.dim_300x400.jpg",
  },
  {
    id: "prod3",
    title: "Crypto & Web3 Wealth System",
    description:
      "Advanced guide to cryptocurrency trading, DeFi, and building passive income with Web3.",
    benefits: [
      "Crypto fundamentals & wallets",
      "DeFi yield farming strategies",
      "NFT creation & trading",
      "Portfolio risk management",
      "Tax compliance for crypto",
      "Passive income with staking",
    ],
    price: 500000,
    cashbackPercent: 10,
    isEnabled: true,
    author: "Arjun Mehta",
    rating: 4.7,
    reviews: 156,
    cover: "/assets/generated/book-crypto-web3.dim_300x400.jpg",
  },
  {
    id: "prod4",
    title: "Elite Investment Mastery",
    description:
      "Professional-grade investment strategies, portfolio management, and financial freedom blueprint.",
    benefits: [
      "Advanced equity analysis",
      "Real estate investment guide",
      "International diversification",
      "Options & derivatives basics",
      "Wealth preservation tactics",
      "Freedom number calculator",
    ],
    price: 800000,
    cashbackPercent: 10,
    isEnabled: true,
    author: "Vikram Tiwari",
    rating: 4.9,
    reviews: 98,
    cover: "/assets/generated/book-elite-investment.dim_300x400.jpg",
  },
];

const INITIAL_TASKS: Task[] = [
  {
    id: "task1",
    title: "Follow us on Instagram",
    description:
      "Follow @neochainx on Instagram and share your Instagram username as proof.",
    rewardAmount: 5000,
    isActive: true,
  },
  {
    id: "task2",
    title: "Write a Product Review",
    description:
      "Write an honest review about any NeoChainX product and share your review link.",
    rewardAmount: 10000,
    isActive: true,
  },
];

const ADMIN_USER: User = {
  id: "admin1",
  name: "Sandeep",
  email: "admin@neochainx.com",
  password: "Sandeep@321",
  role: "admin",
  pendingBalance: 0,
  approvedBalance: 0,
  referralCode: "ADMIN",
  referralUnlocked: true,
  isBanned: false,
  createdAt: Date.now(),
};

interface AppContextType {
  // Current user
  currentUser: User | null;
  // Navigation
  currentPage: string;
  navigate: (page: string) => void;
  // Auth
  login: (
    email: string,
    password: string,
  ) => { success: boolean; message: string };
  signup: (
    name: string,
    email: string,
    password: string,
    referralCode?: string,
  ) => { success: boolean; message: string };
  logout: () => void;
  // Data
  users: User[];
  products: Product[];
  purchases: Purchase[];
  paymentOrders: PaymentOrder[];
  tasks: Task[];
  taskSubmissions: TaskSubmission[];
  notifications: Notification[];
  walletTransactions: WalletTransaction[];
  activityLogs: ActivityLog[];
  qrCodes: QRCode[];
  settings: AppSettings;
  // Actions
  createPaymentOrder: (
    productId: string,
    method: string,
    screenshotName: string,
  ) => void;
  approvePaymentOrder: (orderId: string, note: string) => void;
  rejectPaymentOrder: (orderId: string, note: string) => void;
  submitTask: (taskId: string, proof: string) => void;
  approveTaskSubmission: (submissionId: string) => void;
  rejectTaskSubmission: (submissionId: string) => void;
  markNotificationRead: (notifId: string) => void;
  updateProduct: (product: Product) => void;
  updateUserBalance: (
    userId: string,
    amount: number,
    type: "add" | "deduct",
  ) => void;
  banUser: (userId: string, ban: boolean) => void;
  createTask: (title: string, desc: string, reward: number) => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  updateQRCode: (qr: QRCode) => void;
  addActivityLog: (action: string, details: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    loadFromStorage("ncx_current_user", null),
  );
  const [currentPage, setCurrentPage] = useState(() => {
    const stored = loadFromStorage<string>("ncx_page", "/");
    return stored;
  });
  const [users, setUsers] = useState<User[]>(() =>
    loadFromStorage("ncx_users", [ADMIN_USER]),
  );
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage("ncx_products", INITIAL_PRODUCTS),
  );
  const [purchases, setPurchases] = useState<Purchase[]>(() =>
    loadFromStorage("ncx_purchases", []),
  );
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>(() =>
    loadFromStorage("ncx_payment_orders", []),
  );
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadFromStorage("ncx_tasks", INITIAL_TASKS),
  );
  const [taskSubmissions, setTaskSubmissions] = useState<TaskSubmission[]>(() =>
    loadFromStorage("ncx_task_submissions", []),
  );
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    loadFromStorage("ncx_notifications", []),
  );
  const [walletTransactions, setWalletTransactions] = useState<
    WalletTransaction[]
  >(() => loadFromStorage("ncx_wallet_txns", []));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() =>
    loadFromStorage("ncx_activity_logs", []),
  );
  const [qrCodes, setQRCodes] = useState<QRCode[]>(() =>
    loadFromStorage("ncx_qr_codes", [
      {
        id: "qr1",
        method: "upi",
        label: "UPI / Google Pay / PhonePe / Paytm",
        imageData: "",
        isEnabled: true,
      },
      {
        id: "qr2",
        method: "esewa",
        label: "eSewa (Nepal)",
        imageData: "",
        isEnabled: true,
      },
      {
        id: "qr3",
        method: "khalti",
        label: "Khalti (Nepal)",
        imageData: "",
        isEnabled: true,
      },
      {
        id: "qr4",
        method: "usdt",
        label: "USDT (Bybit Pay)",
        imageData: "",
        isEnabled: true,
      },
    ]),
  );
  const [settings, setSettings] = useState<AppSettings>(() =>
    loadFromStorage("ncx_settings", {
      referralEnabled: true,
      referralCommissionPercent: 20,
    }),
  );

  // Persist to localStorage
  useEffect(() => {
    saveToStorage("ncx_users", users);
  }, [users]);
  useEffect(() => {
    saveToStorage("ncx_products", products);
  }, [products]);
  useEffect(() => {
    saveToStorage("ncx_purchases", purchases);
  }, [purchases]);
  useEffect(() => {
    saveToStorage("ncx_payment_orders", paymentOrders);
  }, [paymentOrders]);
  useEffect(() => {
    saveToStorage("ncx_tasks", tasks);
  }, [tasks]);
  useEffect(() => {
    saveToStorage("ncx_task_submissions", taskSubmissions);
  }, [taskSubmissions]);
  useEffect(() => {
    saveToStorage("ncx_notifications", notifications);
  }, [notifications]);
  useEffect(() => {
    saveToStorage("ncx_wallet_txns", walletTransactions);
  }, [walletTransactions]);
  useEffect(() => {
    saveToStorage("ncx_activity_logs", activityLogs);
  }, [activityLogs]);
  useEffect(() => {
    saveToStorage("ncx_qr_codes", qrCodes);
  }, [qrCodes]);
  useEffect(() => {
    saveToStorage("ncx_settings", settings);
  }, [settings]);
  useEffect(() => {
    saveToStorage("ncx_current_user", currentUser);
  }, [currentUser]);
  useEffect(() => {
    saveToStorage("ncx_page", currentPage);
  }, [currentPage]);

  const navigate = useCallback((page: string) => {
    setCurrentPage(page);
  }, []);

  const addNotification = useCallback((userId: string, message: string) => {
    const notif: Notification = {
      id: generateId(),
      userId,
      message,
      isRead: false,
      createdAt: Date.now(),
    };
    setNotifications((prev) => [notif, ...prev]);
  }, []);

  const addWalletTx = useCallback(
    (userId: string, amount: number, txType: string, description: string) => {
      const tx: WalletTransaction = {
        id: generateId(),
        userId,
        amount,
        txType,
        description,
        createdAt: Date.now(),
      };
      setWalletTransactions((prev) => [tx, ...prev]);
    },
    [],
  );

  const addActivityLog = useCallback(
    (action: string, details: string) => {
      const log: ActivityLog = {
        id: generateId(),
        action,
        userId: currentUser?.id || "system",
        details,
        createdAt: Date.now(),
      };
      setActivityLogs((prev) => [log, ...prev].slice(0, 500));
    },
    [currentUser],
  );

  const login = useCallback(
    (email: string, password: string) => {
      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password,
      );
      if (!user)
        return { success: false, message: "Invalid email or password." };
      if (user.isBanned)
        return {
          success: false,
          message: "Your account has been suspended. Contact support.",
        };
      const updated = {
        ...user,
        loginHistory: [
          ...(user.loginHistory || []),
          new Date().toISOString(),
        ].slice(-10),
      };
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
      setCurrentUser(updated);
      addActivityLog("LOGIN", `User ${user.email} logged in`);
      return { success: true, message: "Login successful" };
    },
    [users, addActivityLog],
  );

  const signup = useCallback(
    (name: string, email: string, password: string, referralCode?: string) => {
      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: "Email already registered." };
      }
      const referrer = referralCode
        ? users.find((u) => u.referralCode === referralCode.toUpperCase())
        : undefined;
      const newUser: User = {
        id: generateId(),
        name,
        email,
        password,
        role: "user",
        pendingBalance: 0,
        approvedBalance: 0,
        referralCode:
          name.toUpperCase().replace(/\s+/g, "").substring(0, 4) +
          Math.random().toString(36).substr(2, 4).toUpperCase(),
        referralUnlocked: false,
        referredBy: referrer?.id,
        isBanned: false,
        createdAt: Date.now(),
      };
      setUsers((prev) => [...prev, newUser]);
      addActivityLog("SIGNUP", `New user registered: ${email}`);
      return { success: true, message: "Account created" };
    },
    [users, addActivityLog],
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCurrentPage("/");
  }, []);

  const createPaymentOrder = useCallback(
    (productId: string, method: string, screenshotName: string) => {
      if (!currentUser) return;
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      const order: PaymentOrder = {
        id: generateId(),
        userId: currentUser.id,
        productId,
        amount: product.price,
        paymentMethod: method,
        screenshotName,
        status: "pending",
        adminNote: "",
        createdAt: Date.now(),
      };
      setPaymentOrders((prev) => [order, ...prev]);
      addNotification(
        currentUser.id,
        `Your payment for "${product.title}" is under review.`,
      );
      addActivityLog(
        "PAYMENT_ORDER",
        `User ${currentUser.email} submitted payment for ${product.title}`,
      );
    },
    [currentUser, products, addNotification, addActivityLog],
  );

  const approvePaymentOrder = useCallback(
    (orderId: string, note: string) => {
      const order = paymentOrders.find((o) => o.id === orderId);
      if (!order) return;
      const product = products.find((p) => p.id === order.productId);
      if (!product) return;
      const cashback = Math.floor(
        (order.amount * product.cashbackPercent) / 100,
      );

      // Update order
      setPaymentOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "verified", adminNote: note } : o,
        ),
      );

      // Create purchase
      const purchase: Purchase = {
        id: generateId(),
        userId: order.userId,
        productId: order.productId,
        amount: order.amount,
        cashbackAmount: cashback,
        status: "completed",
        paymentMethod: order.paymentMethod,
        createdAt: Date.now(),
      };
      setPurchases((prev) => [purchase, ...prev]);

      // Credit cashback + unlock referral
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === order.userId) {
            return {
              ...u,
              pendingBalance: u.pendingBalance + cashback,
              referralUnlocked: true,
            };
          }
          return u;
        }),
      );

      // Update currentUser if it's the same user
      setCurrentUser((prev) => {
        if (prev && prev.id === order.userId) {
          return {
            ...prev,
            pendingBalance: prev.pendingBalance + cashback,
            referralUnlocked: true,
          };
        }
        return prev;
      });

      addWalletTx(
        order.userId,
        cashback,
        "CASHBACK",
        `Cashback for ${product.title}`,
      );
      addNotification(
        order.userId,
        `Payment approved! ₹${(cashback / 100).toFixed(0)} cashback credited. Referral system unlocked!`,
      );

      // Referral commission
      if (settings.referralEnabled) {
        const buyer = users.find((u) => u.id === order.userId);
        if (buyer?.referredBy) {
          const commission = Math.floor(
            (order.amount * settings.referralCommissionPercent) / 100,
          );
          setUsers((prev) =>
            prev.map((u) =>
              u.id === buyer.referredBy
                ? { ...u, pendingBalance: u.pendingBalance + commission }
                : u,
            ),
          );
          setCurrentUser((prev) => {
            if (prev && prev.id === buyer.referredBy) {
              return {
                ...prev,
                pendingBalance: prev.pendingBalance + commission,
              };
            }
            return prev;
          });
          addWalletTx(
            buyer.referredBy,
            commission,
            "REFERRAL",
            `Referral commission from ${buyer.name}`,
          );
          addNotification(
            buyer.referredBy,
            `You earned ₹${(commission / 100).toFixed(0)} referral commission!`,
          );
        }
      }

      addActivityLog(
        "APPROVE_PAYMENT",
        `Payment approved for order ${orderId}`,
      );
    },
    [
      paymentOrders,
      products,
      users,
      settings,
      addWalletTx,
      addNotification,
      addActivityLog,
    ],
  );

  const rejectPaymentOrder = useCallback(
    (orderId: string, note: string) => {
      setPaymentOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "rejected", adminNote: note } : o,
        ),
      );
      const order = paymentOrders.find((o) => o.id === orderId);
      if (order) {
        addNotification(
          order.userId,
          `Payment rejected. Reason: ${note || "Please contact support."}`,
        );
        addActivityLog(
          "REJECT_PAYMENT",
          `Payment rejected for order ${orderId}`,
        );
      }
    },
    [paymentOrders, addNotification, addActivityLog],
  );

  const submitTask = useCallback(
    (taskId: string, proof: string) => {
      if (!currentUser) return;
      const sub: TaskSubmission = {
        id: generateId(),
        userId: currentUser.id,
        taskId,
        proof,
        status: "pending",
        createdAt: Date.now(),
      };
      setTaskSubmissions((prev) => [sub, ...prev]);
      addActivityLog(
        "TASK_SUBMIT",
        `User ${currentUser.email} submitted task ${taskId}`,
      );
    },
    [currentUser, addActivityLog],
  );

  const approveTaskSubmission = useCallback(
    (submissionId: string) => {
      const sub = taskSubmissions.find((s) => s.id === submissionId);
      if (!sub) return;
      const task = tasks.find((t) => t.id === sub.taskId);
      if (!task) return;
      setTaskSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId ? { ...s, status: "approved" } : s,
        ),
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === sub.userId
            ? { ...u, approvedBalance: u.approvedBalance + task.rewardAmount }
            : u,
        ),
      );
      setCurrentUser((prev) => {
        if (prev && prev.id === sub.userId)
          return {
            ...prev,
            approvedBalance: prev.approvedBalance + task.rewardAmount,
          };
        return prev;
      });
      addWalletTx(
        sub.userId,
        task.rewardAmount,
        "TASK_REWARD",
        `Task reward: ${task.title}`,
      );
      addNotification(
        sub.userId,
        `Task "${task.title}" approved! ₹${(task.rewardAmount / 100).toFixed(0)} credited to your wallet.`,
      );
      addActivityLog(
        "APPROVE_TASK",
        `Task submission ${submissionId} approved`,
      );
    },
    [taskSubmissions, tasks, addWalletTx, addNotification, addActivityLog],
  );

  const rejectTaskSubmission = useCallback(
    (submissionId: string) => {
      setTaskSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId ? { ...s, status: "rejected" } : s,
        ),
      );
      const sub = taskSubmissions.find((s) => s.id === submissionId);
      if (sub) {
        const task = tasks.find((t) => t.id === sub.taskId);
        addNotification(
          sub.userId,
          `Task "${task?.title}" submission was rejected.`,
        );
        addActivityLog(
          "REJECT_TASK",
          `Task submission ${submissionId} rejected`,
        );
      }
    },
    [taskSubmissions, tasks, addNotification, addActivityLog],
  );

  const markNotificationRead = useCallback((notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n)),
    );
  }, []);

  const updateProduct = useCallback(
    (product: Product) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p)),
      );
      addActivityLog("UPDATE_PRODUCT", `Product ${product.id} updated`);
    },
    [addActivityLog],
  );

  const updateUserBalance = useCallback(
    (userId: string, amount: number, type: "add" | "deduct") => {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== userId) return u;
          const delta = type === "add" ? amount : -amount;
          return {
            ...u,
            approvedBalance: Math.max(0, u.approvedBalance + delta),
          };
        }),
      );
      setCurrentUser((prev) => {
        if (prev && prev.id === userId) {
          const delta = type === "add" ? amount : -amount;
          return {
            ...prev,
            approvedBalance: Math.max(0, prev.approvedBalance + delta),
          };
        }
        return prev;
      });
      const user = users.find((u) => u.id === userId);
      addWalletTx(
        userId,
        type === "add" ? amount : -amount,
        type === "add" ? "ADMIN_ADD" : "ADMIN_DEDUCT",
        `Admin balance ${type === "add" ? "added" : "deducted"}`,
      );
      addNotification(
        userId,
        `Admin ${type === "add" ? "added" : "deducted"} ₹${(amount / 100).toFixed(0)} ${type === "add" ? "to" : "from"} your wallet.`,
      );
      addActivityLog(
        "BALANCE_UPDATE",
        `Admin ${type} ₹${amount / 100} for user ${user?.email}`,
      );
    },
    [users, addWalletTx, addNotification, addActivityLog],
  );

  const banUser = useCallback(
    (userId: string, ban: boolean) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isBanned: ban } : u)),
      );
      addActivityLog(
        "BAN_USER",
        `User ${userId} ${ban ? "banned" : "unbanned"}`,
      );
    },
    [addActivityLog],
  );

  const createTask = useCallback(
    (title: string, desc: string, reward: number) => {
      const task: Task = {
        id: generateId(),
        title,
        description: desc,
        rewardAmount: reward,
        isActive: true,
      };
      setTasks((prev) => [...prev, task]);
      addActivityLog("CREATE_TASK", `Task created: ${title}`);
    },
    [addActivityLog],
  );

  const updateSettings = useCallback((s: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...s }));
  }, []);

  const updateQRCode = useCallback(
    (qr: QRCode) => {
      setQRCodes((prev) => prev.map((q) => (q.id === qr.id ? qr : q)));
      addActivityLog("UPDATE_QR", `QR code updated for ${qr.method}`);
    },
    [addActivityLog],
  );

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentPage,
        navigate,
        login,
        signup,
        logout,
        users,
        products,
        purchases,
        paymentOrders,
        tasks,
        taskSubmissions,
        notifications,
        walletTransactions,
        activityLogs,
        qrCodes,
        settings,
        createPaymentOrder,
        approvePaymentOrder,
        rejectPaymentOrder,
        submitTask,
        approveTaskSubmission,
        rejectTaskSubmission,
        markNotificationRead,
        updateProduct,
        updateUserBalance,
        banUser,
        createTask,
        updateSettings,
        updateQRCode,
        addActivityLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
