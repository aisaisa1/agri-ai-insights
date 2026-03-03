import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, BarChart3, FlaskConical, Globe } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Leaf },
  { path: "/sensor", label: "Sensor Input", icon: FlaskConical },
  { path: "/result", label: "AI Result", icon: BarChart3 },
  { path: "/insight", label: "Global Insight", icon: Globe },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
    >
      <div className="mx-auto max-w-6xl">
        <div className="glass-card flex items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-primary">
              AgriAI
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg border border-accent/30 bg-accent/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="status-dot" />
            <span className="hidden sm:inline">System Active</span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
