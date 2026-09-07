import "./App.css";
import { useEffect, useMemo, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";

/* =========================================================
   SAMPLE PRODUCT DATA
========================================================= */

const productData = {
  "All Products": {
    sales: "₹2.48M",
    demand: "8,421",
    growth: "+18.4%",
    accuracy: "94.8%",
    status: "STRONG MOMENTUM",
    forecast: [
      { month: "Jan", actual: 120, forecast: null },
      { month: "Feb", actual: 135, forecast: null },
      { month: "Mar", actual: 128, forecast: null },
      { month: "Apr", actual: 150, forecast: null },
      { month: "May", actual: 168, forecast: null },
      { month: "Jun", actual: 175, forecast: 175 },
      { month: "Jul", actual: null, forecast: 188 },
      { month: "Aug", actual: null, forecast: 205 },
      { month: "Sep", actual: null, forecast: 218 },
      { month: "Oct", actual: null, forecast: 235 },
    ],
  },

  Laptop: {
    sales: "₹840K",
    demand: "2,640",
    growth: "+22.6%",
    accuracy: "96.2%",
    status: "HIGH DEMAND",
    forecast: [
      { month: "Jan", actual: 90, forecast: null },
      { month: "Feb", actual: 105, forecast: null },
      { month: "Mar", actual: 98, forecast: null },
      { month: "Apr", actual: 118, forecast: null },
      { month: "May", actual: 132, forecast: null },
      { month: "Jun", actual: 145, forecast: 145 },
      { month: "Jul", actual: null, forecast: 160 },
      { month: "Aug", actual: null, forecast: 176 },
      { month: "Sep", actual: null, forecast: 192 },
      { month: "Oct", actual: null, forecast: 210 },
    ],
  },

  Smartphone: {
    sales: "₹710K",
    demand: "3,120",
    growth: "+14.8%",
    accuracy: "93.7%",
    status: "STEADY GROWTH",
    forecast: [
      { month: "Jan", actual: 110, forecast: null },
      { month: "Feb", actual: 124, forecast: null },
      { month: "Mar", actual: 119, forecast: null },
      { month: "Apr", actual: 136, forecast: null },
      { month: "May", actual: 150, forecast: null },
      { month: "Jun", actual: 158, forecast: 158 },
      { month: "Jul", actual: null, forecast: 170 },
      { month: "Aug", actual: null, forecast: 182 },
      { month: "Sep", actual: null, forecast: 194 },
      { month: "Oct", actual: null, forecast: 206 },
    ],
  },

  Headphones: {
    sales: "₹415K",
    demand: "1,980",
    growth: "+11.2%",
    accuracy: "92.9%",
    status: "STABLE",
    forecast: [
      { month: "Jan", actual: 75, forecast: null },
      { month: "Feb", actual: 82, forecast: null },
      { month: "Mar", actual: 80, forecast: null },
      { month: "Apr", actual: 91, forecast: null },
      { month: "May", actual: 104, forecast: null },
      { month: "Jun", actual: 111, forecast: 111 },
      { month: "Jul", actual: null, forecast: 118 },
      { month: "Aug", actual: null, forecast: 126 },
      { month: "Sep", actual: null, forecast: 136 },
      { month: "Oct", actual: null, forecast: 148 },
    ],
  },
};

const sparklineData = [
  { value: 20 },
  { value: 28 },
  { value: 25 },
  { value: 38 },
  { value: 45 },
  { value: 42 },
  { value: 58 },
];

/* =========================================================
   MAIN APP
========================================================= */

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  /* LOGIN */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginMode, setLoginMode] = useState("login");
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("Employee");
  const [loginError, setLoginError] = useState("");

  /* AI */
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState(
    "Select a suggested question or ask ForecastIQ about demand, growth, inventory, or model confidence."
  );
  const [aiThinking, setAiThinking] = useState(false);

  const [product, setProduct] = useState("All Products");
  const [category, setCategory] = useState("All Categories");
  const [year, setYear] = useState("2026");

  const [theme, setTheme] = useState("dark");

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [showIntro, setShowIntro] = useState(true);

  const [forecastStatus, setForecastStatus] = useState("idle");
  const [forecastRunId, setForecastRunId] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");
  const [forecastResult, setForecastResult] = useState(null);

  const [alertsOpen, setAlertsOpen] = useState(false);

  /* REPORTS */
  const [reportStatus, setReportStatus] = useState("idle");
  const [reportMessage, setReportMessage] = useState("");

  const [recentReports, setRecentReports] = useState([
    {
      id: 1,
      title: "Monthly Demand Intelligence",
      product: "All Products",
      period: "2026",
      date: "Latest",
      status: "READY",
    },
    {
      id: 2,
      title: "Laptop Growth Analysis",
      product: "Laptop",
      period: "2026",
      date: "Previous",
      status: "READY",
    },
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: "Forecast completed",
      message: "Latest demand forecast completed successfully.",
      type: "success",
      time: "Just now",
    },
    {
      id: 2,
      title: "Demand spike detected",
      message: "Projected demand is trending above the recent average.",
      type: "warning",
      time: "4 min ago",
    },
    {
      id: 3,
      title: "Inventory attention",
      message:
        "Inventory planning may need adjustment before peak demand.",
      type: "warning",
      time: "11 min ago",
    },
    {
      id: 4,
      title: "Model confidence",
      message:
        "Forecast confidence remains within the optimal range.",
      type: "info",
      time: "18 min ago",
    },
  ]);

  useEffect(() => {
    const introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    document.body.className =
      theme === "light" ? "light-mode" : "";
  }, [theme]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setAlertsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

 const baseSelected = productData[product];

const hasRealForecast =
  forecastResult &&
  forecastResult.product === product;

const realForecastData = hasRealForecast
  ? forecastResult.forecast.map((item) => ({
      month: item.date.slice(5),
      fullDate: item.date,
      actual: null,
      forecast: item.value,
    }))
  : [];

const selected = hasRealForecast
  ? {
      ...baseSelected,

      demand: Number(
        forecastResult.projected_demand
      ).toLocaleString("en-IN", {
        maximumFractionDigits: 0,
      }),

      growth: forecastResult.growth,

      accuracy: forecastResult.accuracy,

      forecast: realForecastData,
    }
  : baseSelected;

  const demandData = useMemo(() => {
  return selected.forecast.map((item) => ({
    month: item.month,
    demand: item.actual ?? item.forecast ?? 0,
  }));
}, [selected]);

  const analyticsProducts = useMemo(() => {
    return ["Laptop", "Smartphone", "Headphones"].map((name) => ({
      name,
      sales: productData[name].sales,
      demand: Number(productData[name].demand.replace(/,/g, "")),
      growth: Number(
        productData[name].growth.replace(/[+%]/g, "")
      ),
      accuracy: Number(
        productData[name].accuracy.replace("%", "")
      ),
      status: productData[name].status,
    }));
  }, []);

  const secondaryAxis =
    theme === "light" ? "#5b6d82" : "#768295";

  const secondaryGrid =
    theme === "light"
      ? "rgba(30,50,75,0.10)"
      : "rgba(255,255,255,0.055)";

  /* =========================================================
     HANDLERS
  ========================================================= */
const handleRunForecast = async () => {
  if (forecastStatus === "loading") return;

  setForecastStatus("loading");

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/forecast",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: product,
          year: year,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Backend returned an error.");
    }

    const data = await response.json();

    console.log("Backend forecast:", data);
    setForecastResult(data);


    setForecastRunId((prev) => prev + 1);
    setLastUpdated("UPDATED JUST NOW");
    setForecastStatus("ready");

    setTimeout(() => {
      setForecastStatus("idle");
    }, 1200);

    setTimeout(() => {
      setLastUpdated("");
    }, 5000);
  } catch (error) {
    console.error("Forecast API error:", error);

    setForecastStatus("idle");

    alert(
      "Unable to connect to the ForecastIQ backend."
    );
  }
};
  
  const handleSearchSelection = (item) => {
    if (productData[item]) {
      setProduct(item);
      setActivePage("Dashboard");
    } else {
      setActivePage(item);
    }

    setSearchOpen(false);
    setSearchQuery("");
  };

  const openProductDashboard = (name) => {
    setProduct(name);
    setActivePage("Dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openProductForecast = (name) => {
    setProduct(name);
    setActivePage("Forecast");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenerateReport = () => {
    if (reportStatus === "loading") return;

    setReportStatus("loading");
    setReportMessage("Analyzing forecast intelligence...");

    setTimeout(() => {
      const newReport = {
        id: Date.now(),
        title:
          product === "All Products"
            ? "Executive Portfolio Forecast"
            : `${product} Forecast Intelligence`,
        product,
        period: year,
        date: "Just now",
        status: "READY",
      };

      setRecentReports((current) =>
        [newReport, ...current].slice(0, 5)
      );

      setReportStatus("ready");
      setReportMessage(
        "Executive report generated successfully."
      );

      setTimeout(() => {
        setReportStatus("idle");
      }, 1800);
    }, 1500);
  };

  const handleExportReport = () => {
    window.print();
  };

  const handleAskAI = (question = aiQuestion) => {
    const finalQuestion = question.trim();

    if (!finalQuestion || aiThinking) return;

    setAiThinking(true);
    setAiQuestion(finalQuestion);

    setTimeout(() => {
      const lower = finalQuestion.toLowerCase();

      if (lower.includes("demand")) {
        setAiResponse(
          `${product} demand is currently projected at ${selected.demand} units with ${selected.growth} expected growth. The current signal is ${selected.status.toLowerCase()}.`
        );
      } else if (lower.includes("inventory")) {
        setAiResponse(
          `Based on the current forecast, inventory should be reviewed before peak demand. A gradual stock increase is preferable to a sudden large adjustment, especially while model confidence remains at ${selected.accuracy}.`
        );
      } else if (
        lower.includes("accuracy") ||
        lower.includes("confidence")
      ) {
        setAiResponse(
          `The current model confidence is ${selected.accuracy}. This indicates the forecast is suitable for planning support, but final operational decisions should still consider live sales and inventory data.`
        );
      } else if (lower.includes("growth")) {
        setAiResponse(
          `${product} is showing ${selected.growth} expected growth. This suggests positive momentum and may support increased purchasing, marketing, and resource allocation.`
        );
      } else {
        setAiResponse(
          `${product} is currently in a ${selected.status.toLowerCase()} state with projected demand of ${selected.demand} units, expected growth of ${selected.growth}, and model confidence of ${selected.accuracy}.`
        );
      }

      setAiThinking(false);
    }, 1000);
  };

  const handleEmployeeLogin = () => {
    setLoginError("");

    if (!employeeId.trim()) {
      setLoginError("Enter your Employee ID.");
      return;
    }

    if (employeeId.trim().length < 4) {
      setLoginError(
        "Employee ID must contain at least 4 characters."
      );
      return;
    }

    setIsLoggedIn(true);
    setActivePage("Dashboard");
    setShowIntro(true);

    setTimeout(() => {
      setShowIntro(false);
    }, 3000);
  };

  const handleCreateEmployee = () => {
    setLoginError("");

    if (!employeeName.trim()) {
      setLoginError("Enter employee name.");
      return;
    }

    if (!employeeId.trim()) {
      setLoginError("Create an Employee ID.");
      return;
    }

    if (employeeId.trim().length < 4) {
      setLoginError(
        "Employee ID must contain at least 4 characters."
      );
      return;
    }

    setIsLoggedIn(true);
    setActivePage("Dashboard");
    setShowIntro(true);

    setTimeout(() => {
      setShowIntro(false);
    }, 3000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginMode("login");
    setEmployeeId("");
    setEmployeeName("");
    setEmployeeRole("Employee");
    setLoginError("");
    setActivePage("Dashboard");
    setSearchOpen(false);
    setAlertsOpen(false);
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <>
      {!isLoggedIn ? (
        <section className="login-gate">
          <div className="login-background-code">
            <span>EMP-1024</span>
            <span>FORECASTIQ</span>
            <span>EMP-2048</span>
            <span>SALES INTELLIGENCE</span>
            <span>EMP-4096</span>
          </div>

          <div className="login-shell">
            <div className="login-brand">
              <div className="login-logo">
                <span className="login-f-vertical"></span>
                <span className="login-f-top"></span>
                <span className="login-f-middle"></span>
              </div>

              <div>
                <small>FORECASTIQ</small>
                <strong>SALES INTELLIGENCE PLATFORM</strong>
              </div>
            </div>

            <div className="login-card">
              <div className="login-card-top">
                <span className="login-status-dot"></span>
                <small>SECURE EMPLOYEE ACCESS</small>
              </div>

              {loginMode === "login" ? (
                <>
                  <h1>Employee Login</h1>

                  <p>
                    Enter your employee ID to access the
                    ForecastIQ intelligence dashboard.
                  </p>

                  <div className="login-field">
                    <label>EMPLOYEE ID</label>

                    <input
                      type="text"
                      value={employeeId}
                      placeholder="Example: EMP-1024"
                      onChange={(e) => {
                        setEmployeeId(e.target.value);
                        setLoginError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEmployeeLogin();
                        }
                      }}
                    />
                  </div>

                  <div className="login-field">
                    <label>ROLE</label>

                    <select
                      value={employeeRole}
                      onChange={(e) =>
                        setEmployeeRole(e.target.value)
                      }
                    >
                      <option>Employee</option>
                      <option>Manager</option>
                      <option>Admin</option>
                    </select>
                  </div>

                  {loginError && (
                    <div className="login-error">
                      <span>!</span>
                      {loginError}
                    </div>
                  )}

                  <button
                    className="login-primary-button"
                    onClick={handleEmployeeLogin}
                  >
                    ACCESS DASHBOARD
                    <span>→</span>
                  </button>

                  <div className="login-switch">
                    <span>New employee?</span>

                    <button
                      onClick={() => {
                        setLoginMode("create");
                        setLoginError("");
                        setEmployeeId("");
                      }}
                    >
                      CREATE EMPLOYEE ID
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h1>Create Employee ID</h1>

                  <p>
                    Register a new employee profile for
                    ForecastIQ dashboard access.
                  </p>

                  <div className="login-field">
                    <label>EMPLOYEE NAME</label>

                    <input
                      type="text"
                      value={employeeName}
                      placeholder="Enter employee name"
                      onChange={(e) => {
                        setEmployeeName(e.target.value);
                        setLoginError("");
                      }}
                    />
                  </div>

                  <div className="login-field">
                    <label>CREATE EMPLOYEE ID</label>

                    <input
                      type="text"
                      value={employeeId}
                      placeholder="Example: EMP-2048"
                      onChange={(e) => {
                        setEmployeeId(e.target.value);
                        setLoginError("");
                      }}
                    />
                  </div>

                  <div className="login-field">
                    <label>ROLE</label>

                    <select
                      value={employeeRole}
                      onChange={(e) =>
                        setEmployeeRole(e.target.value)
                      }
                    >
                      <option>Employee</option>
                      <option>Manager</option>
                      <option>Admin</option>
                    </select>
                  </div>

                  {loginError && (
                    <div className="login-error">
                      <span>!</span>
                      {loginError}
                    </div>
                  )}

                  <button
                    className="login-primary-button"
                    onClick={handleCreateEmployee}
                  >
                    CREATE & CONTINUE
                    <span>→</span>
                  </button>

                  <div className="login-switch">
                    <span>Already registered?</span>

                    <button
                      onClick={() => {
                        setLoginMode("login");
                        setLoginError("");
                        setEmployeeName("");
                        setEmployeeId("");
                      }}
                    >
                      BACK TO LOGIN
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="login-footer">
              <span>FORECASTIQ / ENTERPRISE ACCESS</span>
              <span>SECURE SESSION</span>
            </div>
          </div>
        </section>
      ) : (
        <>
          {showIntro && (
            <div className="minimal-luxury-intro">
              <div className="minimal-intro-content">
                <div className="minimal-intro-logo">
                  <span className="mini-f-vertical"></span>
                  <span className="mini-f-top"></span>
                  <span className="mini-f-middle"></span>
                  <span className="mini-f-shine"></span>
                </div>

                <div className="minimal-intro-brand">
                  FORECASTIQ
                </div>
              </div>
            </div>
          )}

          {searchOpen && (
            <div
              className="search-overlay"
              onClick={() => setSearchOpen(false)}
            >
              <div
                className="search-command"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="search-command-top">
                  <div>
                    <small>
                      FORECASTIQ COMMAND SEARCH
                    </small>
                    <h3>Search Intelligence</h3>
                  </div>

                  <button
                    className="search-close"
                    onClick={() => setSearchOpen(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="search-input-wrap">
                  <span>⌕</span>

                  <input
                    autoFocus
                    type="text"
                    placeholder="Search products, analytics, reports..."
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                  />
                </div>

                <div className="search-results">
                  {[
                    "Dashboard",
                    "Forecast",
                    "Analytics",
                    "Products",
                    "Reports",
                    "AI Intelligence",
                    "Laptop",
                    "Smartphone",
                    "Headphones",
                  ]
                    .filter((item) =>
                      item
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((item) => (
                      <button
                        key={item}
                        className="search-result-item"
                        onClick={() =>
                          handleSearchSelection(item)
                        }
                      >
                        <div>
                          <span className="search-result-dot"></span>
                          <strong>{item}</strong>
                        </div>

                        <span>↗</span>
                      </button>
                    ))}
                </div>

                <div className="search-command-footer">
                  <span>ESC TO CLOSE</span>
                  <span>
                    FORECASTIQ / COMMAND PALETTE
                  </span>
                </div>
              </div>
            </div>
          )}

          {alertsOpen && (
            <div
              className="alerts-overlay"
              onClick={() => setAlertsOpen(false)}
            >
              <aside
                className="alerts-panel"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="alerts-header">
                  <div>
                    <small>SYSTEM MONITOR</small>
                    <h3>Alerts</h3>
                  </div>

                  <button
                    className="alerts-close"
                    onClick={() => setAlertsOpen(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="alerts-summary">
                  <div>
                    <strong>{alerts.length}</strong>
                    <span>ACTIVE EVENTS</span>
                  </div>

                  <button
                    onClick={() => setAlerts([])}
                    disabled={!alerts.length}
                  >
                    MARK ALL READ
                  </button>
                </div>

                <div className="alerts-list">
                  {alerts.length > 0 ? (
                    alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`alert-card alert-${alert.type}`}
                      >
                        <div className="alert-card-top">
                          <div className="alert-indicator"></div>

                          <div>
                            <strong>
                              {alert.title}
                            </strong>
                            <small>{alert.time}</small>
                          </div>
                        </div>

                        <p>{alert.message}</p>

                        <button
                          onClick={() =>
                            setAlerts((current) =>
                              current.filter(
                                (item) =>
                                  item.id !== alert.id
                              )
                            )
                          }
                        >
                          DISMISS
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="alerts-empty">
                      <div className="alerts-empty-icon">
                        ✓
                      </div>

                      <strong>All clear</strong>

                      <p>
                        No active system alerts at the
                        moment.
                      </p>
                    </div>
                  )}
                </div>

                <div className="alerts-footer">
                  FORECASTIQ / SYSTEM MONITOR
                </div>
              </aside>
            </div>
          )}

          <div className="app-shell dashboard-after-intro">
            <div className="ambient ambient-one"></div>
            <div className="ambient ambient-two"></div>
            <div className="grid-overlay"></div>

            <aside className="sidebar">
              <div className="brand">
                <div className="brand-mark">
                  <span></span>
                </div>

                <div>
                  <h2>FORECASTIQ</h2>
                  <small>INTELLIGENCE ENGINE</small>
                </div>
              </div>

              <div className="side-label">
                COMMAND CENTER
              </div>

              <nav>
                {[
                  "Dashboard",
                  "Forecast",
                  "Analytics",
                  "Products",
                  "Reports",
                  "AI Intelligence",
                ].map((item) => (
                  <button
                    key={item}
                    className={`nav-item ${
                      activePage === item ? "active" : ""
                    }`}
                    onClick={() => setActivePage(item)}
                  >
                    <span className="nav-icon">◇</span>
                    {item}
                  </button>
                ))}
              </nav>

              <div className="sidebar-bottom">
                <div className="system-card">
                  <div className="system-top">
                    <span>MODEL ENGINE</span>
                    <span className="online-dot"></span>
                  </div>

                  <strong>ONLINE</strong>

                  <p>
                    Forecasting system operating normally.
                  </p>
                </div>

                <div className="profile-small">
                  <div className="avatar">
                    {employeeName
                      ? employeeName
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "BM"}
                  </div>

                  <div>
                    <strong>
                      {employeeName || "Business Manager"}
                    </strong>

                    <small>{employeeRole}</small>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Logout"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    ↪
                  </button>
                </div>
              </div>
            </aside>

            <main className="main-content">
              <header className="top-header">
                <div className="header-left">
                  <div className="eyebrow">
                    BUSINESS INTELLIGENCE / FORECASTING
                  </div>

                  <h1>
                    SALES
                    <span> INTELLIGENCE.</span>
                  </h1>

                  <p>
                    Predict demand. Anticipate opportunity.
                    Make smarter business decisions.
                  </p>
                </div>

                <div className="header-actions cockpit-dock">
                  <button
                    className="cockpit-button theme-cockpit"
                    onClick={() =>
                      setTheme(
                        theme === "dark"
                          ? "light"
                          : "dark"
                      )
                    }
                  >
                    <span className="cockpit-icon">
                      {theme === "dark" ? "☀" : "☾"}
                    </span>

                    <span className="cockpit-text">
                      <small>DISPLAY</small>
                      <strong>
                        {theme === "dark"
                          ? "LIGHT"
                          : "DARK"}
                      </strong>
                    </span>

                    <span className="button-energy"></span>
                  </button>

                  <button
                    className="cockpit-button search-cockpit"
                    onClick={() => setSearchOpen(true)}
                  >
                    <span className="cockpit-icon search-symbol">
                      ⌕
                    </span>

                    <span className="cockpit-text">
                      <small>GLOBAL</small>
                      <strong>SEARCH</strong>
                    </span>

                    <span className="button-energy"></span>
                  </button>

                  <button
                    className="cockpit-button alert-cockpit"
                    onClick={() => setAlertsOpen(true)}
                  >
                    <span className="cockpit-icon">
                      ◇
                    </span>

                    <span className="cockpit-text">
                      <small>SYSTEM</small>
                      <strong>ALERTS</strong>
                    </span>

                    <span className="alert-status"></span>
                    <span className="button-energy"></span>
                  </button>

                  <div className="live-pill model-command">
                    <div className="model-status-core">
                      <span className="model-status-dot"></span>
                      <span className="model-status-ring"></span>
                    </div>

                    <div className="model-command-text">
                      <small>FORECAST ENGINE</small>
                      <strong>MODEL LIVE</strong>
                    </div>

                    <div className="signal-bars">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <div className="model-scan"></div>
                  </div>
                </div>
              </header>

              {/* =====================================================
                  DASHBOARD
              ===================================================== */}

              {activePage === "Dashboard" && (
                <>
                  <section className="control-bar">
                    <div className="control-title">
                      <span className="control-line"></span>
                      FORECAST CONFIGURATION
                    </div>

                    <div className="filters">
                      <div className="select-box">
                        <label>PRODUCT</label>

                        <select
                          value={product}
                          onChange={(e) =>
                            setProduct(e.target.value)
                          }
                        >
                          <option>All Products</option>
                          <option>Laptop</option>
                          <option>Smartphone</option>
                          <option>Headphones</option>
                        </select>
                      </div>

                      <div className="select-box">
                        <label>CATEGORY</label>

                        <select
                          value={category}
                          onChange={(e) =>
                            setCategory(e.target.value)
                          }
                        >
                          <option>All Categories</option>
                          <option>Electronics</option>
                          <option>Accessories</option>
                        </select>
                      </div>

                      <div className="select-box">
                        <label>PERIOD</label>

                        <select
                          value={year}
                          onChange={(e) =>
                            setYear(e.target.value)
                          }
                        >
                          <option>2026</option>
                          <option>2025</option>
                          <option>2024</option>
                        </select>
                      </div>

                      <div className="forecast-action-area">
                        <button
                          className={`run-button ${
                            forecastStatus ===
                            "loading"
                              ? "forecast-loading"
                              : forecastStatus ===
                                "ready"
                              ? "forecast-ready"
                              : ""
                          }`}
                          onClick={handleRunForecast}
                          disabled={
                            forecastStatus === "loading"
                          }
                        >
                          {forecastStatus ===
                          "loading" ? (
                            <>
                              <span className="forecast-spinner"></span>
                              ANALYZING
                            </>
                          ) : forecastStatus ===
                            "ready" ? (
                            <>
                              FORECAST READY
                              <span>✓</span>
                            </>
                          ) : (
                            <>
                              RUN FORECAST
                              <span>→</span>
                            </>
                          )}
                        </button>

                        {lastUpdated && (
                          <div className="forecast-update-status">
                            <span></span>
                            {lastUpdated}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>

                  <section
                    className="kpi-grid"
                    key={`kpi-${forecastRunId}`}
                  >
                    <KpiCard
  number="02"
  label="PROJECTED SALES"
  value={selected.demand}
  suffix=""
  trend={
    hasRealForecast
      ? "30-DAY TOTAL"
      : "↑ 12.6%"
  }
  detail={
    hasRealForecast
      ? "real ML forecast"
      : "projected demand"
  }
/>
                    

                    <KpiCard
                    number="03"
                    label="EXPECTED GROWTH"
                    value={selected.growth}
                    trend={
                      hasRealForecast &&
                      Number(forecastResult.growth.replace("%", "")) < 0
                      ? "DECLINING"
                      : "POSITIVE"
                    }
                    detail={
                      hasRealForecast
                      ? "30-DAY FORECAST TREND"
                      : selected.status
                      }
                      />

                    

                    <KpiCard
                      number="04"
                      label="MODEL ACCURACY"
                      value={selected.accuracy}
                      trend="EXCELLENT"
                      detail="forecast confidence"
                    />
                  </section>

                  <section className="hero-chart panel">
                    <div className="panel-top">
                      <div>
                        <div className="mini-title">
                          01 / FORECAST ENGINE
                        </div>

                        <h2>
                          SALES <span>TRAJECTORY</span>
                        </h2>

                        <p>
                          Historical performance and
                          AI-generated future demand.
                        </p>
                      </div>

                      <div className="chart-legend">
                        <div>
                          <span className="legend-line actual-line"></span>
                          ACTUAL
                        </div>

                        <div>
                          <span className="legend-line forecast-line"></span>
                          FORECAST
                        </div>
                      </div>
                    </div>

                    <div className="chart-stage">
                      <div className="forecast-zone">
                        <span>AI FORECAST ZONE</span>
                      </div>

                      <ResponsiveContainer
                        width="100%"
                        height={390}
                      >
                        <LineChart
                          key={`line-${forecastRunId}-${product}-${year}`}
                          data={selected.forecast}
                          margin={{
                            top: 30,
                            right: 24,
                            left: -12,
                            bottom: 8,
                          }}
                        >
                          <defs>
                            <linearGradient
                              id="actualLineGradient"
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="0"
                            >
                              <stop
                                offset="0%"
                                stopColor="#9aa7b8"
                              />
                              <stop
                                offset="100%"
                                stopColor="#f4f7fb"
                              />
                            </linearGradient>

                            <linearGradient
                              id="forecastLineGradient"
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="0"
                            >
                              <stop
                                offset="0%"
                                stopColor="#e49b00"
                              />
                              <stop
                                offset="100%"
                                stopColor="#ffd154"
                              />
                            </linearGradient>
                          </defs>

                          <CartesianGrid
                            stroke="rgba(255,255,255,0.045)"
                            strokeDasharray="3 7"
                            vertical={false}
                          />

                          <XAxis
                            dataKey="month"
                            interval={hasRealForecast ? 4 : 0}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                            tick={{
                              fill: "#7e8a9c",
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          />

                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            dx={-6}
                            tick={{
                              fill: "#7e8a9c",
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          />

                          <Tooltip
                            content={<PremiumTooltip />}
                            cursor={false}
                          />

                          <Line
                            type="monotone"
                            dataKey="actual"
                            stroke="url(#actualLineGradient)"
                            strokeWidth={2.4}
                            dot={{
                              r: 3,
                              fill: "#0d141d",
                              stroke: "#dce5ee",
                              strokeWidth: 1.8,
                            }}
                            animationDuration={1100}
                            name="Actual"
                          />

                          <Line
                            type="monotone"
                            dataKey="forecast"
                            stroke="url(#forecastLineGradient)"
                            strokeWidth={2.8}
                            strokeDasharray="7 5"
                            dot={{
                              r: 3,
                              fill: "#ffb703",
                              stroke: "#17110a",
                              strokeWidth: 1.6,
                            }}
                            animationDuration={1450}
                            connectNulls
                            name="Forecast"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="forecast-footer">
                      <div>
                        <span>FORECAST HORIZON</span>
                        <strong>
  {hasRealForecast ? "30 DAYS" : "4 MONTHS"}
</strong>
                        
                      </div>

                      <div>
                        <span>MODEL STATUS</span>
                        <strong className="success-text">
                          OPTIMAL
                        </strong>
                      </div>

                      <div>
                        <span>CONFIDENCE</span>
                        <strong>
                          {selected.accuracy}
                        </strong>
                      </div>
                    </div>
                  </section>

                  <section className="intelligence-grid">
                    <div className="panel demand-panel">
                      <div className="panel-top">
                        <div>
                          <div className="mini-title">
                            02 / DEMAND SIGNAL
                          </div>

                          <h2>
                            MARKET <span>MOMENTUM</span>
                          </h2>
                        </div>

                        <div className="momentum-tag">
                          {selected.growth}
                        </div>
                      </div>

                      <ResponsiveContainer
                        width="100%"
                        height={280}
                      >
                        <BarChart
                          key={`bar-${forecastRunId}-${product}-${year}`}
                          data={demandData}
                          margin={{
                            top: 24,
                            right: 10,
                            left: -12,
                            bottom: 0,
                          }}
                          barCategoryGap="28%"
                        >
                          <defs>
                            <linearGradient
                              id="demandBarGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#4a8cff"
                              />
                              <stop
                                offset="55%"
                                stopColor="#2f6ed8"
                              />
                              <stop
                                offset="100%"
                                stopColor="#153f8d"
                              />
                            </linearGradient>
                          </defs>

                          <CartesianGrid
                            stroke={secondaryGrid}
                            strokeDasharray="3 7"
                            vertical={false}
                          />

                          <XAxis
                            dataKey="month"
                            interval={hasRealForecast ? 4 : 0}
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fill: secondaryAxis,
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          />

                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fill: secondaryAxis,
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          />

                          <Tooltip
                            content={<PremiumTooltip />}
                            cursor={false}
                          />

                          <Bar
                            dataKey="demand"
                            fill="url(#demandBarGradient)"
                            radius={[7, 7, 2, 2]}
                            maxBarSize={32}
                            animationDuration={1150}
                            name="Demand"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="panel model-panel">
                      <div className="mini-title">
                        03 / MODEL PRECISION
                      </div>

                      <h2>
                        PERFORMANCE <span>CORE</span>
                      </h2>

                      <div className="accuracy-ring">
                        <div className="ring-inner">
                          <strong>
                            {selected.accuracy}
                          </strong>
                          <span>ACCURACY</span>
                        </div>
                      </div>

                      <div className="metric-stack">
                        <Metric
                          name="R² SCORE"
                          value={selected.accuracy}
                          width="95%"
                        />

                        <Metric
                          name="MAE"
                          value="3.42"
                          width="72%"
                        />

                        <Metric
                          name="RMSE"
                          value="5.17"
                          width="61%"
                        />

                        <Metric
                          name="MAPE"
                          value="6.2%"
                          width="88%"
                        />
                      </div>
                    </div>
                  </section>

                  <section className="strategy-panel panel">
                    <div className="strategy-heading">
                      <div>
                        <div className="mini-title">
                          04 / AI STRATEGY ENGINE
                        </div>

                        <h2>
                          EXECUTIVE{" "}
                          <span>INTELLIGENCE</span>
                        </h2>

                        <p>
                          Decision-ready recommendations
                          generated from the latest forecast
                          signal.
                        </p>
                      </div>

                      <div className="ai-orb">
                        <div></div>
                        AI
                      </div>
                    </div>

                    <div className="strategy-grid">
                      <StrategyCard
                        number="01"
                        title="DEMAND SIGNAL"
                        tag="POSITIVE"
                        text={`${product} demand is showing strong upward momentum across the forecast horizon.`}
                      />

                      <StrategyCard
                        number="02"
                        title="INVENTORY ACTION"
                        tag="RECOMMENDED"
                        text="Increase inventory allocation by approximately 15–20% before peak demand."
                      />

                      <StrategyCard
                        number="03"
                        title="BUSINESS OPPORTUNITY"
                        tag="HIGH"
                        text="Use the forecast to coordinate purchasing, staffing and targeted promotional campaigns."
                      />
                    </div>
                  </section>

                  <section className="bottom-grid">
                    <div className="panel signal-panel">
                      <div className="mini-title">
                        LIVE SIGNAL
                      </div>

                      <h3>Forecast Momentum</h3>

                      <div className="signal-chart">
                        <ResponsiveContainer
                          width="100%"
                          height={120}
                        >
                          <AreaChart
                            key={`area-${forecastRunId}-${product}-${year}`}
                            data={sparklineData}
                          >
                            <defs>
                              <linearGradient
                                id="signalGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="#ffb703"
                                  stopOpacity={0.24}
                                />

                                <stop
                                  offset="100%"
                                  stopColor="#ffb703"
                                  stopOpacity={0}
                                />
                              </linearGradient>

                              <linearGradient
                                id="signalStroke"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="#d89300"
                                />
                                <stop
                                  offset="100%"
                                  stopColor="#ffd154"
                                />
                              </linearGradient>
                            </defs>

                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke="url(#signalStroke)"
                              fill="url(#signalGradient)"
                              strokeWidth={2.2}
                              dot={false}
                              animationDuration={1250}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="signal-footer">
                        <strong>
                          {selected.growth}
                        </strong>
                        <span>
                          UPWARD TRAJECTORY
                        </span>
                      </div>
                    </div>

                    <div className="panel executive-summary">
                      <div className="mini-title">
                        EXECUTIVE SUMMARY
                      </div>

                      <h3>
                        What does this forecast mean?
                      </h3>

                      <p>
                        The model expects demand and sales
                        to increase over the coming months.
                        Businesses can use this information
                        to prepare inventory, purchasing and
                        operational resources before demand
                        peaks.
                      </p>

                      <button
                        onClick={() =>
                          setActivePage("Reports")
                        }
                      >
                        GENERATE REPORT
                        <span>↗</span>
                      </button>
                    </div>
                  </section>
                </>
              )}

              {/* =====================================================
                  FORECAST
              ===================================================== */}

              {activePage === "Forecast" && (
                <section className="forecast-page">
                  <div className="forecast-page-header">
                    <div>
                      <div className="mini-title">
                        FORECASTIQ / FORECAST ENGINE
                      </div>

                      <h2>
                        DEMAND{" "}
                        <span>
                          FORECAST WORKSPACE
                        </span>
                      </h2>

                      <p>
                        Configure forecasting parameters
                        and generate future demand
                        intelligence.
                      </p>
                    </div>

                    <div className="forecast-engine-status">
                      <span></span>

                      <div>
                        <small>MODEL STATUS</small>
                        <strong>READY</strong>
                      </div>
                    </div>
                  </div>

                  <div className="forecast-config-grid">
                    <div className="panel forecast-config-panel">
                      <div className="mini-title">
                        01 / CONFIGURATION
                      </div>

                      <h3>Forecast Parameters</h3>

                      <div className="forecast-form-grid">
                        <div className="select-box">
                          <label>PRODUCT</label>

                          <select
                            value={product}
                            onChange={(e) =>
                              setProduct(e.target.value)
                            }
                          >
                            <option>
                              All Products
                            </option>
                            <option>Laptop</option>
                            <option>Smartphone</option>
                            <option>Headphones</option>
                          </select>
                        </div>

                        <div className="select-box">
                          <label>
                            FORECAST PERIOD
                          </label>

                          <select
                            value={year}
                            onChange={(e) =>
                              setYear(e.target.value)
                            }
                          >
                            <option>2026</option>
                            <option>2025</option>
                            <option>2024</option>
                          </select>
                        </div>

                        <div className="select-box">
                          <label>
                            FORECAST HORIZON
                          </label>
                          <select defaultValue="30 Days">
  <option>30 Days</option>
</select>


                          
                        </div>

                        <div className="select-box">
                          <label>SCENARIO</label>

                          <select defaultValue="Balanced">
                            <option>
                              Conservative
                            </option>
                            <option>Balanced</option>
                            <option>
                              Aggressive Growth
                            </option>
                          </select>
                        </div>
                      </div>

                      <button
                        className={`run-button forecast-page-run ${
                          forecastStatus === "loading"
                            ? "forecast-loading"
                            : forecastStatus ===
                              "ready"
                            ? "forecast-ready"
                            : ""
                        }`}
                        onClick={handleRunForecast}
                        disabled={
                          forecastStatus === "loading"
                        }
                      >
                        {forecastStatus ===
                        "loading" ? (
                          <>
                            <span className="forecast-spinner"></span>
                            ANALYZING DATA
                          </>
                        ) : forecastStatus ===
                          "ready" ? (
                          <>
                            FORECAST GENERATED
                            <span>✓</span>
                          </>
                        ) : (
                          <>
                            RUN FORECAST
                            <span>→</span>
                          </>
                        )}
                      </button>

                      {lastUpdated && (
                        <div className="forecast-update-status">
                          <span></span>
                          {lastUpdated}
                        </div>
                      )}
                    </div>

                    <div className="forecast-metrics-grid">
                      <div className="forecast-metric-card">
  <span>PROJECTED SALES</span>
  <strong>{selected.demand}</strong>
  <small>
    {hasRealForecast ? "30-DAY TOTAL" : "FORECAST VALUE"}
  </small>
</div>
                      
                      <div className="forecast-metric-card">
                        <span>
                          EXPECTED GROWTH
                        </span>
                        <strong>
                          {selected.growth}
                        </strong>
                        <small>
  {hasRealForecast
    ? Number(forecastResult.growth.replace("%", "")) < 0
      ? "DECLINING TREND"
      : "POSITIVE TREND"
    : selected.status}
</small>
                        
                      </div>

                      <div className="forecast-metric-card">
                        <span>
                          MODEL CONFIDENCE
                        </span>
                        <strong>
                          {selected.accuracy}
                        </strong>
                        <small>
                          FORECAST ACCURACY
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="panel forecast-main-chart">
                    <div className="panel-top">
                      <div>
                        <div className="mini-title">
                          02 / PREDICTION CURVE
                        </div>

                        <h2>
                          FUTURE{" "}
                          <span>
                            DEMAND TRAJECTORY
                          </span>
                        </h2>

                        <p>
                          Historical demand compared with
                          the generated forecast horizon.
                        </p>
                      </div>

                      <div className="chart-legend">
                        <div>
                          <span className="legend-line actual-line"></span>
                          ACTUAL
                        </div>

                        <div>
                          <span className="legend-line forecast-line"></span>
                          FORECAST
                        </div>
                      </div>
                    </div>

                    <ResponsiveContainer
                      width="100%"
                      height={360}
                    >
                      <LineChart
                        key={`forecast-page-${forecastRunId}-${product}-${year}`}
                        data={selected.forecast}
                        margin={{
                          top: 30,
                          right: 25,
                          left: -10,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid
                          stroke={secondaryGrid}
                          strokeDasharray="3 7"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: secondaryAxis,
                            fontSize: 10,
                            fontWeight: 600,
                          }}
                        />

                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: secondaryAxis,
                            fontSize: 10,
                            fontWeight: 600,
                          }}
                        />

                        <Tooltip
                          content={<PremiumTooltip />}
                          cursor={false}
                        />

                        <Line
                          type="monotone"
                          dataKey="actual"
                          stroke="#dfe7ef"
                          strokeWidth={2.3}
                          dot={{
                            r: 3,
                            fill: "#101820",
                            stroke: "#dfe7ef",
                            strokeWidth: 1.5,
                          }}
                          animationDuration={1000}
                          name="Actual"
                        />

                        <Line
                          type="monotone"
                          dataKey="forecast"
                          stroke="#ffb703"
                          strokeWidth={2.7}
                          strokeDasharray="7 5"
                          dot={{
                            r: 3,
                            fill: "#ffb703",
                            stroke: "#111820",
                            strokeWidth: 1.5,
                          }}
                          animationDuration={1300}
                          connectNulls
                          name="Forecast"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="panel forecast-table-panel">
                    <div className="mini-title">
                      03 / FORECAST OUTPUT
                    </div>

                    <h3>Predicted Demand</h3>

                    <div className="forecast-table">
                      <div className="forecast-table-row forecast-table-head">
                        <span>MONTH</span>
                        <span>ACTUAL</span>
                        <span>FORECAST</span>
                        <span>STATUS</span>
                      </div>

                      {selected.forecast.map(
                        (item) => (
                          <div
                            key={item.month}
                            className="forecast-table-row"
                          >
                            <span>
                              {item.month}
                            </span>

                            <span>
                              {item.actual ?? "—"}
                            </span>

                            <span>
                              {item.forecast ??
                                "—"}
                            </span>

                            <span
                              className={
                                item.forecast !==
                                null
                                  ? "forecast-row-active"
                                  : ""
                              }
                            >
                              {item.forecast !==
                              null
                                ? "PREDICTED"
                                : "HISTORICAL"}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* =====================================================
                  ANALYTICS
              ===================================================== */}

              {activePage === "Analytics" && (
                <section className="analytics-page">
                  <div className="analytics-page-header">
                    <div>
                      <div className="mini-title">
                        FORECASTIQ / BUSINESS ANALYTICS
                      </div>

                      <h2>
                        PERFORMANCE{" "}
                        <span>ANALYTICS</span>
                      </h2>

                      <p>
                        Compare demand, growth and
                        forecasting performance across the
                        product portfolio.
                      </p>
                    </div>

                    <div className="analytics-live-status">
                      <span></span>

                      <div>
                        <small>DATA STATUS</small>
                        <strong>LIVE</strong>
                      </div>
                    </div>
                  </div>

                  <div className="analytics-kpi-grid">
                    <div className="analytics-kpi-card">
                      <small>
                        TOTAL PORTFOLIO DEMAND
                      </small>
                      <strong>7,740</strong>
                      <span>UNITS ANALYZED</span>
                    </div>

                    <div className="analytics-kpi-card">
                      <small>
                        TOP GROWTH PRODUCT
                      </small>
                      <strong>Laptop</strong>
                      <span>+22.6% GROWTH</span>
                    </div>

                    <div className="analytics-kpi-card">
                      <small>
                        BEST MODEL ACCURACY
                      </small>
                      <strong>96.2%</strong>
                      <span>LAPTOP MODEL</span>
                    </div>

                    <div className="analytics-kpi-card">
                      <small>
                        PORTFOLIO TREND
                      </small>
                      <strong>Positive</strong>
                      <span>
                        UPWARD MOMENTUM
                      </span>
                    </div>
                  </div>

                  <div className="analytics-main-grid">
                    <div className="panel analytics-demand-panel">
                      <div className="panel-top">
                        <div>
                          <div className="mini-title">
                            01 / PRODUCT COMPARISON
                          </div>

                          <h2>
                            DEMAND{" "}
                            <span>
                              DISTRIBUTION
                            </span>
                          </h2>

                          <p>
                            Current demand volume across
                            major products.
                          </p>
                        </div>
                      </div>

                      <ResponsiveContainer
                        width="100%"
                        height={320}
                      >
                        <BarChart
                          data={analyticsProducts}
                          margin={{
                            top: 20,
                            right: 20,
                            left: -10,
                            bottom: 5,
                          }}
                        >
                          <defs>
                            <linearGradient
                              id="analyticsBarGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#4a8cff"
                              />
                              <stop
                                offset="100%"
                                stopColor="#153f8d"
                              />
                            </linearGradient>
                          </defs>

                          <CartesianGrid
                            stroke={secondaryGrid}
                            strokeDasharray="3 7"
                            vertical={false}
                          />

                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fill: secondaryAxis,
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          />

                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{
                              fill: secondaryAxis,
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          />

                          <Tooltip
                            content={
                              <PremiumTooltip />
                            }
                            cursor={{
                              fill: "transparent",
                            }}
                          />

                          <Bar
                            dataKey="demand"
                            fill="url(#analyticsBarGradient)"
                            radius={[8, 8, 2, 2]}
                            maxBarSize={52}
                            animationDuration={1200}
                            name="Demand"
                            activeBar={false}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="panel analytics-ranking-panel">
                      <div className="mini-title">
                        02 / GROWTH RANKING
                      </div>

                      <h3>Product Momentum</h3>

                      <div className="analytics-ranking-list">
                        {analyticsProducts
                          .slice()
                          .sort(
                            (a, b) =>
                              b.growth - a.growth
                          )
                          .map(
                            (item, index) => (
                              <div
                                className="analytics-ranking-row"
                                key={item.name}
                              >
                                <div className="analytics-rank-number">
                                  0{index + 1}
                                </div>

                                <div className="analytics-rank-info">
                                  <strong>
                                    {item.name}
                                  </strong>

                                  <span>
                                    {item.demand.toLocaleString()}{" "}
                                    units
                                  </span>
                                </div>

                                <div className="analytics-rank-growth">
                                  +{item.growth}%
                                </div>
                              </div>
                            )
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="analytics-secondary-grid">
                    <div className="panel analytics-accuracy-panel">
                      <div className="mini-title">
                        03 / MODEL PERFORMANCE
                      </div>

                      <h3>Forecast Accuracy</h3>

                      <div className="analytics-accuracy-list">
                        {analyticsProducts.map(
                          (item) => (
                            <div
                              className="analytics-accuracy-row"
                              key={item.name}
                            >
                              <div className="analytics-accuracy-head">
                                <span>
                                  {item.name}
                                </span>

                                <strong>
                                  {item.accuracy}%
                                </strong>
                              </div>

                              <div className="analytics-accuracy-track">
                                <div
                                  className="analytics-accuracy-fill"
                                  style={{
                                    width: `${item.accuracy}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="panel analytics-insight-panel">
                      <div className="mini-title">
                        04 / ANALYTIC INSIGHT
                      </div>

                      <h3>
                        Portfolio Intelligence
                      </h3>

                      <div className="analytics-insight-item">
                        <span>01</span>

                        <div>
                          <strong>
                            Laptop leads growth
                          </strong>

                          <p>
                            Laptop demand currently has
                            the strongest growth rate at
                            +22.6%.
                          </p>
                        </div>
                      </div>

                      <div className="analytics-insight-item">
                        <span>02</span>

                        <div>
                          <strong>
                            Smartphone leads volume
                          </strong>

                          <p>
                            Smartphone maintains the
                            highest individual product
                            demand at 3,120 units.
                          </p>
                        </div>
                      </div>

                      <div className="analytics-insight-item">
                        <span>03</span>

                        <div>
                          <strong>
                            Models remain stable
                          </strong>

                          <p>
                            All product forecasting
                            models currently operate
                            above 92% reported accuracy.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* =====================================================
                  PRODUCTS
              ===================================================== */}

              {activePage === "Products" && (
                <section className="products-page">
                  <div className="products-page-header">
                    <div>
                      <div className="mini-title">
                        FORECASTIQ / PRODUCT INTELLIGENCE
                      </div>

                      <h2>
                        PRODUCT{" "}
                        <span>PORTFOLIO</span>
                      </h2>

                      <p>
                        Monitor product performance,
                        demand, growth and forecasting
                        confidence from one workspace.
                      </p>
                    </div>

                    <div className="products-status">
                      <span></span>

                      <div>
                        <small>
                          PORTFOLIO STATUS
                        </small>
                        <strong>
                          3 ACTIVE PRODUCTS
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="products-summary-grid">
                    <div className="products-summary-card">
                      <small>ACTIVE PRODUCTS</small>
                      <strong>03</strong>
                      <span>PORTFOLIO ITEMS</span>
                    </div>

                    <div className="products-summary-card">
                      <small>TOTAL DEMAND</small>
                      <strong>7,740</strong>
                      <span>COMBINED UNITS</span>
                    </div>

                    <div className="products-summary-card">
                      <small>BEST GROWTH</small>
                      <strong>+22.6%</strong>
                      <span>LAPTOP</span>
                    </div>

                    <div className="products-summary-card">
                      <small>AVG. ACCURACY</small>
                      <strong>94.3%</strong>
                      <span>MODEL PORTFOLIO</span>
                    </div>
                  </div>

                  <div className="products-card-grid">
                    {analyticsProducts.map(
                      (item, index) => (
                        <div
                          key={item.name}
                          className="product-portfolio-card panel"
                        >
                          <div className="product-card-top">
                            <div className="product-index">
                              0{index + 1}
                            </div>

                            <div className="product-health">
                              <span></span>
                              ACTIVE
                            </div>
                          </div>

                          <div className="product-card-title">
                            <small>
                              PRODUCT INTELLIGENCE
                            </small>

                            <h3>{item.name}</h3>

                            <span>
                              {item.status}
                            </span>
                          </div>

                          <div className="product-card-metrics">
                            <div>
                              <small>SALES</small>
                              <strong>
                                {item.sales}
                              </strong>
                            </div>

                            <div>
                              <small>DEMAND</small>
                              <strong>
                                {item.demand.toLocaleString()}
                              </strong>
                            </div>

                            <div>
                              <small>GROWTH</small>
                              <strong>
                                +{item.growth}%
                              </strong>
                            </div>

                            <div>
                              <small>
                                ACCURACY
                              </small>
                              <strong>
                                {item.accuracy}%
                              </strong>
                            </div>
                          </div>

                          <div className="product-accuracy-line">
                            <div>
                              <span>
                                MODEL CONFIDENCE
                              </span>

                              <strong>
                                {item.accuracy}%
                              </strong>
                            </div>

                            <div className="product-accuracy-track">
                              <div
                                className="product-accuracy-fill"
                                style={{
                                  width: `${item.accuracy}%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="product-card-actions">
                            <button
                              onClick={() =>
                                openProductDashboard(
                                  item.name
                                )
                              }
                            >
                              OPEN DASHBOARD
                              <span>→</span>
                            </button>

                            <button
                              onClick={() =>
                                openProductForecast(
                                  item.name
                                )
                              }
                            >
                              OPEN FORECAST
                              <span>↗</span>
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div className="panel products-comparison-panel">
                    <div className="products-comparison-heading">
                      <div>
                        <div className="mini-title">
                          01 / PORTFOLIO COMPARISON
                        </div>

                        <h3>
                          Product Performance Matrix
                        </h3>
                      </div>

                      <span>
                        LIVE PORTFOLIO DATA
                      </span>
                    </div>

                    <div className="products-table">
                      <div className="products-table-row products-table-head">
                        <span>PRODUCT</span>
                        <span>SALES</span>
                        <span>DEMAND</span>
                        <span>GROWTH</span>
                        <span>ACCURACY</span>
                        <span>STATUS</span>
                      </div>

                      {analyticsProducts.map(
                        (item) => (
                          <div
                            className="products-table-row"
                            key={item.name}
                          >
                            <strong>
                              {item.name}
                            </strong>

                            <span>{item.sales}</span>

                            <span>
                              {item.demand.toLocaleString()}
                            </span>

                            <span className="products-positive">
                              +{item.growth}%
                            </span>

                            <span>
                              {item.accuracy}%
                            </span>

                            <span className="products-status-text">
                              {item.status}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="products-bottom-grid">
                    <div className="panel products-insight-panel">
                      <div className="mini-title">
                        02 / PORTFOLIO INSIGHT
                      </div>

                      <h3>
                        Performance Overview
                      </h3>

                      <p>
                        Laptop currently leads
                        portfolio growth and model
                        accuracy, while Smartphone
                        carries the highest demand
                        volume. Headphones remain
                        stable and support consistent
                        portfolio demand.
                      </p>
                    </div>

                    <div className="panel products-health-panel">
                      <div className="mini-title">
                        03 / PORTFOLIO HEALTH
                      </div>

                      <h3>
                        Operational Status
                      </h3>

                      <div className="products-health-list">
                        <div>
                          <span></span>
                          <strong>
                            3 / 3 PRODUCTS ACTIVE
                          </strong>
                        </div>

                        <div>
                          <span></span>
                          <strong>
                            MODEL COVERAGE OPTIMAL
                          </strong>
                        </div>

                        <div>
                          <span></span>
                          <strong>
                            NO CRITICAL ISSUES
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* =====================================================
                  REPORTS
              ===================================================== */}

              {activePage === "Reports" && (
                <section className="reports-page">
                  <div className="reports-page-header">
                    <div>
                      <div className="mini-title">
                        FORECASTIQ / EXECUTIVE REPORTING
                      </div>

                      <h2>
                        INTELLIGENCE{" "}
                        <span>REPORTS</span>
                      </h2>

                      <p>
                        Transform forecasting data
                        into structured executive
                        intelligence for planning,
                        review and decision-making.
                      </p>
                    </div>

                    <div className="reports-live-status">
                      <span></span>

                      <div>
                        <small>
                          REPORT ENGINE
                        </small>
                        <strong>READY</strong>
                      </div>
                    </div>
                  </div>

                  <div className="reports-control-panel panel">
                    <div className="reports-control-heading">
                      <div>
                        <div className="mini-title">
                          01 / REPORT CONFIGURATION
                        </div>

                        <h3>
                          Executive Report Builder
                        </h3>

                        <p>
                          Select the business scope
                          and generate a
                          decision-ready forecasting
                          report.
                        </p>
                      </div>

                      <div className="reports-engine-chip">
                        <span></span>
                        INTELLIGENCE ENGINE ONLINE
                      </div>
                    </div>

                    <div className="reports-filter-grid">
                      <div className="reports-field">
                        <label>
                          PRODUCT SCOPE
                        </label>

                        <select
                          value={product}
                          onChange={(e) =>
                            setProduct(
                              e.target.value
                            )
                          }
                        >
                          <option>
                            All Products
                          </option>
                          <option>Laptop</option>
                          <option>
                            Smartphone
                          </option>
                          <option>
                            Headphones
                          </option>
                        </select>
                      </div>

                      <div className="reports-field">
                        <label>
                          REPORT PERIOD
                        </label>

                        <select
                          value={year}
                          onChange={(e) =>
                            setYear(
                              e.target.value
                            )
                          }
                        >
                          <option>2026</option>
                          <option>2025</option>
                          <option>2024</option>
                        </select>
                      </div>

                      <div className="reports-field">
                        <label>
                          REPORT TYPE
                        </label>

                        <select defaultValue="Executive Intelligence">
                          <option>
                            Executive Intelligence
                          </option>
                          <option>
                            Demand Forecast
                          </option>
                          <option>
                            Product Performance
                          </option>
                          <option>
                            Model Performance
                          </option>
                        </select>
                      </div>

                      <div className="reports-field">
                        <label>
                          FORECAST HORIZON
                        </label>

                        <select defaultValue="30 Days">
                          <option>30 Days</option>
                          </select>
                          </div>
                          </div>

                    <div className="reports-actions">
                      <button
                        className={`reports-generate-button ${
                          reportStatus ===
                          "loading"
                            ? "reports-generating"
                            : reportStatus ===
                              "ready"
                            ? "reports-generated"
                            : ""
                        }`}
                        onClick={
                          handleGenerateReport
                        }
                        disabled={
                          reportStatus ===
                          "loading"
                        }
                      >
                        {reportStatus ===
                        "loading" ? (
                          <>
                            <span className="forecast-spinner"></span>
                            GENERATING REPORT
                          </>
                        ) : reportStatus ===
                          "ready" ? (
                          <>
                            REPORT READY
                            <span>✓</span>
                          </>
                        ) : (
                          <>
                            GENERATE REPORT
                            <span>→</span>
                          </>
                        )}
                      </button>

                      <button
                        className="reports-export-button"
                        onClick={
                          handleExportReport
                        }
                      >
                        EXPORT PDF
                        <span>↗</span>
                      </button>
                    </div>

                    {reportMessage && (
                      <div className="reports-message">
                        <span></span>
                        {reportMessage}
                      </div>
                    )}
                  </div>

                  <div className="reports-kpi-grid">
                    <div className="reports-kpi-card">
  <small>PROJECTED SALES</small>
  <strong>{selected.demand}</strong>
  <span>30-DAY TOTAL</span>
</div>

<div className="reports-kpi-card">
  <small>EXPECTED GROWTH</small>
  <strong>{selected.growth}</strong>
  <span>
    {hasRealForecast
      ? Number(forecastResult.growth.replace("%", "")) < 0
        ? "DECLINING TREND"
        : "POSITIVE TREND"
      : selected.status}
  </span>
</div>

                    
                    
                    <div className="reports-kpi-card">
                      <small>
                        MODEL CONFIDENCE
                      </small>
                      <strong>
                        {selected.accuracy}
                      </strong>
                      <span>
                        FORECAST ACCURACY
                      </span>
                    </div>

                    <div className="reports-kpi-card">
                      <small>
                        SALES VALUE
                      </small>
                      <strong>
                        {selected.sales}
                      </strong>
                      <span>
                        PORTFOLIO VALUE
                      </span>
                    </div>
                  </div>

                  <div className="reports-main-grid">
                    <div className="panel reports-executive-panel">
                      <div className="mini-title">
                        02 / EXECUTIVE SUMMARY
                      </div>

                      <div className="reports-summary-heading">
                        <div>
                          <h3>
                            Business Intelligence
                            Brief
                          </h3>

                          <p>
                            Decision summary generated
                            from the selected forecast
                            configuration.
                          </p>
                        </div>

                        <span className="reports-ai-badge">
                          AI INSIGHT
                        </span>
                      </div>

                      <div className="reports-summary-list">
                        <div className="reports-summary-item">
                          <span>01</span>

                          <div>
                            <strong>
                              Demand outlook
                            </strong>

                            <p>
                              <p>
  The aggregate sales forecast projects a 30-day total of{" "}
  {selected.demand}, with expected growth of {selected.growth}.
</p>
                              
                            </p>
                          </div>
                        </div>

                        <div className="reports-summary-item">
                          <span>02</span>

                          <div>
                            <strong>
                              Growth expectation
                            </strong>

                            <p>
                              Forecast intelligence
                              indicates expected growth
                              of {selected.growth} across
                              the selected planning
                              period.
                            </p>
                          </div>
                        </div>

                        <div className="reports-summary-item">
                          <span>03</span>

                          <div>
                            <strong>
                              Model confidence
                            </strong>

                            <p>
                              Forecast confidence
                              currently stands at{" "}
                              {selected.accuracy},
                              supporting operational
                              planning and inventory
                              decisions.
                            </p>
                          </div>
                        </div>

                        <div className="reports-summary-item">
                          <span>04</span>

                          <div>
                            <strong>
                              Recommended action
                            </strong>

                            <p>
                              Review purchasing, inventory and resource planning carefully during
                              the forecast period. Current growth is {selected.growth}, so avoid
                              unnecessary stock expansion and continue monitoring the latest sales
                              signals.

                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="panel reports-confidence-panel">
                      <div className="mini-title">
                        03 / REPORT QUALITY
                      </div>

                      <h3>
                        Forecast Confidence
                      </h3>

                      <div className="reports-confidence-value">
                        {selected.accuracy}
                      </div>

                      <span className="reports-confidence-label">
                        MODEL CONFIDENCE
                      </span>

                      <div className="reports-confidence-track">
                        <div
                          className="reports-confidence-fill"
                          style={{
                            width:
                              selected.accuracy,
                          }}
                        ></div>
                      </div>

                      <div className="reports-confidence-details">
                        <div>
                          <span>
                            MODEL STATUS
                          </span>
                          <strong>
                            OPTIMAL
                          </strong>
                        </div>

                        <div>
                          <span>
                            DATA QUALITY
                          </span>
                          <strong>HIGH</strong>
                        </div>

                        <div>
                          <span>
                            FORECAST SIGNAL
                          </span>
                          <strong>
                            POSITIVE
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="panel reports-forecast-table-panel">
                    <div className="reports-table-heading">
                      <div>
                        <div className="mini-title">
                          04 / FORECAST DATA
                        </div>

                        <h3>
                          Forecast Output Summary
                        </h3>
                      </div>

                      <span>
                        {product.toUpperCase()} /{" "}
                        {year}
                      </span>
                    </div>

                    <div className="reports-table">
                      <div className="reports-table-row reports-table-head">
                        <span>MONTH</span>
                        <span>ACTUAL</span>
                        <span>FORECAST</span>
                        <span>
                          CLASSIFICATION
                        </span>
                      </div>

                      {selected.forecast.map(
                        (item) => (
                          <div
                            className="reports-table-row"
                            key={item.month}
                          >
                            <strong>
                              {item.month}
                            </strong>

                            <span>
                              {item.actual ?? "—"}
                            </span>

                            <span>
                              {item.forecast ??
                                "—"}
                            </span>

                            {item.forecast !==
                            null ? (
                              <span className="reports-predicted-badge">
                                PREDICTED
                              </span>
                            ) : (
                              <span className="reports-historical-badge">
                                HISTORICAL
                              </span>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="reports-bottom-grid">
                    <div className="panel reports-recent-panel">
                      <div className="reports-section-heading">
                        <div>
                          <div className="mini-title">
                            05 / REPORT HISTORY
                          </div>

                          <h3>
                            Recent Reports
                          </h3>
                        </div>

                        <span>
                          {recentReports.length}{" "}
                          AVAILABLE
                        </span>
                      </div>

                      <div className="reports-recent-list">
                        {recentReports.map(
                          (report) => (
                            <div
                              className="reports-recent-item"
                              key={report.id}
                            >
                              <div className="reports-file-mark">
                                R
                              </div>

                              <div className="reports-file-info">
                                <strong>
                                  {
                                    report.title
                                  }
                                </strong>

                                <span>
                                  {
                                    report.product
                                  }{" "}
                                  •{" "}
                                  {
                                    report.period
                                  }
                                </span>
                              </div>

                              <div className="reports-file-date">
                                {report.date}
                              </div>

                              <span className="reports-ready-badge">
                                {report.status}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="panel reports-decision-panel">
                      <div className="mini-title">
                        06 / DECISION SUPPORT
                      </div>

                      <h3>
                        Management Recommendation
                      </h3>

                      <p>
                        Current forecast intelligence
                        supports proactive inventory
                        planning. Maintain sufficient
                        stock coverage, monitor product
                        momentum and review demand
                        signals before each purchasing
                        cycle.
                      </p>

                      <div className="reports-decision-status">
                        <span></span>

                        <div>
                          <small>
                            BUSINESS OUTLOOK
                          </small>
                          <strong>
                            POSITIVE
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* =====================================================
                  AI INTELLIGENCE
              ===================================================== */}

              {activePage === "AI Intelligence" && (
                <section className="ai-page">
                  <div className="ai-page-header">
                    <div>
                      <div className="mini-title">
                        FORECASTIQ / AI DECISION ENGINE
                      </div>

                      <h2>
                        AI <span>INTELLIGENCE</span>
                      </h2>

                      <p>
                        Explore forecast explanations,
                        business recommendations,
                        operational risks and decision
                        support using the active
                        forecasting data.
                      </p>
                    </div>

                    <div className="ai-system-status">
                      <span></span>

                      <div>
                        <small>AI ENGINE</small>
                        <strong>ONLINE</strong>
                      </div>
                    </div>
                  </div>

                  <div className="ai-main-grid">
                    <div className="panel ai-assistant-panel">
                      <div className="mini-title">
                        01 / AI ASSISTANT
                      </div>

                      <h3>
                        ForecastIQ Advisor
                      </h3>

                      <p className="ai-assistant-description">
                        Ask questions about current
                        demand, forecast confidence,
                        growth trends and recommended
                        business actions.
                      </p>

                      <div className="ai-response-box">
                        <div className="ai-response-top">
                          <span className="ai-core-dot"></span>

                          <strong>
                            {aiThinking
                              ? "ANALYZING..."
                              : "AI RESPONSE"}
                          </strong>
                        </div>

                        <p>
                          {aiThinking
                            ? "ForecastIQ is analyzing the current forecasting data..."
                            : aiResponse}
                        </p>
                      </div>

                      <div className="ai-suggestions">
                        <button
                          onClick={() =>
                            handleAskAI(
                              "Why is demand rising?"
                            )
                          }
                        >
                          Why is demand rising?
                        </button>

                        <button
                          onClick={() =>
                            handleAskAI(
                              "What inventory action should I take?"
                            )
                          }
                        >
                          What inventory action should
                          I take?
                        </button>

                        <button
                          onClick={() =>
                            handleAskAI(
                              "How reliable is the model confidence?"
                            )
                          }
                        >
                          How reliable is the model?
                        </button>

                        <button
                          onClick={() =>
                            handleAskAI(
                              "Explain the expected growth."
                            )
                          }
                        >
                          Explain expected growth
                        </button>
                      </div>

                      <div className="ai-input-area">
                        <input
                          type="text"
                          value={aiQuestion}
                          placeholder="Ask ForecastIQ a business question..."
                          onChange={(e) =>
                            setAiQuestion(
                              e.target.value
                            )
                          }
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter"
                            ) {
                              handleAskAI();
                            }
                          }}
                        />

                        <button
                          onClick={() =>
                            handleAskAI()
                          }
                          disabled={aiThinking}
                        >
                          {aiThinking
                            ? "THINKING"
                            : "ASK AI"}
                          <span>→</span>
                        </button>
                      </div>
                    </div>

                    <div className="panel ai-signal-panel">
                      <div className="mini-title">
                        02 / CURRENT SIGNAL
                      </div>

                      <h3>
                        Forecast Context
                      </h3>

                      <div className="ai-signal-value">
                        {selected.growth}
                      </div>

                      <span className="ai-signal-caption">
                        EXPECTED GROWTH
                      </span>

                      <div className="ai-signal-list">
                        <div>
  <span>FORECAST SCOPE</span>
  <strong>
    {hasRealForecast ? "Aggregate Sales" : product}
  </strong>
</div>

<div>
  <span>PROJECTED SALES</span>
  <strong>{selected.demand}</strong>
</div>

<div>
  <span>CONFIDENCE</span>
  <strong>{selected.accuracy}</strong>
</div>

<div>
  <span>STATUS</span>
  <strong>
    {hasRealForecast
      ? Number(forecastResult.growth.replace("%", "")) < 0
        ? "DECLINING"
        : "POSITIVE"
      : selected.status}
  </strong>
</div>
</div>
</div>
</div>

                        

                  <div className="ai-insight-grid">
                    <div className="panel ai-insight-card">
                      <span className="ai-insight-number">
                        01
                      </span>

                      <small>SALES OUTLOOK</small>

<h3>Demand Moderation</h3>

<p>
  Current forecast growth is {selected.growth}, indicating a softer
  sales outlook. Maintain balanced inventory and review new sales
  signals before increasing product allocation.
</p>

<span className="ai-opportunity-badge">
  CAUTIOUS OUTLOOK
</span>

                      
                    </div>

                    <div className="panel ai-insight-card">
                      <span className="ai-insight-number">
                        02
                      </span>
                      <small>RISK</small>

<h3>Inventory Adjustment Risk</h3>

<p>
  With expected growth at {selected.growth}, avoid aggressive inventory
  expansion. Review stock coverage and purchasing plans before making
  large adjustments.
</p>

<span className="ai-risk-badge">
  REVIEW
</span>

                      
                    </div>

                    <div className="panel ai-insight-card">
                      <span className="ai-insight-number">
                        03
                      </span>

                      <small>MODEL</small>

                      <h3>
                        Forecast Reliability
                      </h3>

                      <p>
                        Model confidence remains at{" "}
                        {selected.accuracy},
                        supporting the use of the
                        forecast for planning and
                        management review.
                      </p>

                      <span className="ai-model-badge">
                        OPTIMAL
                      </span>
                    </div>
                  </div>

                  <div className="ai-bottom-grid">
                    <div className="panel ai-recommendation-panel">
                      <div className="mini-title">
                        03 / RECOMMENDED ACTIONS
                      </div>

                      <h3>
                        Executive Action Plan
                      </h3>

                      <div className="ai-action-list">
                        <div>
                          <span>01</span>

                          <div>
                            <strong>
                              Review inventory
                              coverage
                            </strong>

                            <p>
                              Compare current stock
                              levels with projected
                              future demand before the
                              next purchasing cycle.
                            </p>
                          </div>
                        </div>

                        <div>
                          <span>02</span>

                          <div>
                            <strong>
  Adjust operational resources carefully
</strong>

<p>
  Align staffing, purchasing and distribution capacity with the current
  declining forecast. Avoid unnecessary expansion and review new sales
  signals before increasing resources.
</p>
                            
                          </div>
                        </div>

                        <div>
                          <span>03</span>

                          <div>
                            <strong>
                              Track forecast changes
                            </strong>

                            <p>
                              Re-run the forecast as
                              new sales data becomes
                              available and compare
                              changes in model
                              confidence.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="panel ai-health-panel">
                      <div className="mini-title">
                        04 / AI SYSTEM HEALTH
                      </div>

                      <h3>
                        Decision Engine Status
                      </h3>

                      <div className="ai-health-list">
                        <div>
                          <span></span>
                          <strong>
                            FORECAST ENGINE ONLINE
                          </strong>
                        </div>

                        <div>
                          <span></span>
                          <strong>
                            MODEL CONFIDENCE STABLE
                          </strong>
                        </div>

                        <div>
                          <span></span>
                          <strong>
                            BUSINESS SIGNAL DECLINING
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activePage !== "Dashboard" &&
                activePage !== "Forecast" &&
                activePage !== "Analytics" &&
                activePage !== "Products" &&
                activePage !== "Reports" &&
                activePage !== "AI Intelligence" && (
                  <section className="page-placeholder">
                    <div className="page-placeholder-top">
                      <span>
                        FORECASTIQ / MODULE
                      </span>
                    </div>

                    <div className="page-placeholder-content">
                      <h1>{activePage}</h1>

                      <p>
                        This intelligence module is
                        ready for configuration.
                      </p>

                      <span className="page-status">
                        <i></i>
                        MODULE ONLINE
                      </span>
                    </div>
                  </section>
                )}

              <footer>
                <span>
                  FORECASTIQ / SALES INTELLIGENCE
                  PLATFORM
                </span>

                <span>
                  MODEL ENGINE • ACTIVE
                </span>
              </footer>
            </main>
          </div>
        </>
      )}
    </>
  );
}

/* =========================================================
   KPI CARD
========================================================= */

function KpiCard({
  number,
  label,
  value,
  suffix = "",
  trend,
  detail,
}) {
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <span>{number}</span>
        <span className="kpi-arrow">↗</span>
      </div>

      <div className="kpi-label">
        {label}
      </div>

      <div className="kpi-value">
        {value}
        <small>{suffix}</small>
      </div>

      <div className="kpi-bottom">
        <span>{trend}</span>
        <small>{detail}</small>
      </div>

      <div className="kpi-shine"></div>
    </div>
  );
}

/* =========================================================
   MODEL METRIC
========================================================= */

function Metric({
  name,
  value,
  width,
}) {
  return (
    <div className="metric">
      <div className="metric-head">
        <span>{name}</span>
        <strong>{value}</strong>
      </div>

      <div className="metric-track">
        <div
          className="metric-fill"
          style={{ width }}
        ></div>
      </div>
    </div>
  );
}

/* =========================================================
   STRATEGY CARD
========================================================= */

function StrategyCard({
  number,
  title,
  tag,
  text,
}) {
  return (
    <div className="strategy-card">
      <div className="strategy-number">
        {number}
      </div>

      <div className="strategy-tag">
        {tag}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      <div className="strategy-arrow">
        →
      </div>
    </div>
  );
}

/* =========================================================
   TOOLTIP
========================================================= */

function PremiumTooltip({
  active,
  payload,
  label,
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const validItems = payload.filter(
    (item) =>
      item.value !== null &&
      item.value !== undefined
  );

  if (!validItems.length) {
    return null;
  }

  return (
    <div className="premium-tooltip">
      {label && <small>{label}</small>}

      {validItems.map((item, index) => (
        <div key={index}>
          <span>{item.name}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

export default App;