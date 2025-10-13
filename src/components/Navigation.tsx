import { Link, useLocation } from "react-router-dom";
import { Brain, FileText, Settings, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { to: "/", label: "Dashboard", icon: Brain },
    { to: "/reports", label: "Reports", icon: FileText },
    { to: "/about", label: "About", icon: Info },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* 🖥️ Desktop Navbar */}
      <nav className="hidden sm:block fixed top-0 left-0 right-0 z-50 border-b bg-background/60 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-glow-pulse">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold glow-text">
                Research Agent
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-1 sm:gap-2">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
                    isActive(to)
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 📱 Mobile Bottom Nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-lg shadow-lg flex justify-around py-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex flex-col items-center text-xs transition-all px-3 py-1",
              isActive(to)
                ? "text-primary scale-105"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="w-6 h-6 mb-0.5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Navigation;
