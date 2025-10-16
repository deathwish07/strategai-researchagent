import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

// UI Components (Only Sheet components are needed now)
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Icons
import { Brain, FileText, Settings, Info, Menu } from "lucide-react";

// --- Navigation Configuration ---
// This makes it easy to add or remove links in one place.
const navItems = [
  { to: "/", label: "Dashboard", icon: Brain },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/about", label: "About", icon: Info },
  { to: "/settings", label: "Settings", icon: Settings },
];

// --- Sub-Components for a Cleaner Structure ---

// DesktopNav: Top navigation for larger screens
const DesktopNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="hidden sm:block fixed top-0 left-0 right-0 z-50 border-b bg-background/60 backdrop-blur-lg shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent animate-glow-pulse">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold font-display glow-text">
            Research Agent
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
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
    </nav>
  );
};

// MobileNav: Bottom navigation for smaller screens with a Sheet for extra links
const MobileNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Define which items are always visible vs. which go into the menu
  const primaryNavItems = navItems.slice(0, 3); // Dashboard, Reports, About
  const sheetNavItems = navItems.slice(3); // Settings

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-lg shadow-lg">
      <div className="flex justify-around h-16">
        {primaryNavItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex flex-col items-center justify-center text-xs transition-all w-full",
              isActive(to)
                ? "text-primary scale-105 font-medium"
                : "text-muted-foreground"
            )}
          >
            <Icon className="w-6 h-6 mb-0.5" />
            <span>{label}</span>
          </Link>
        ))}

        {/* Render a menu button only if there are items for the sheet */}
        {sheetNavItems.length > 0 && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center w-full text-xs text-muted-foreground">
                <Menu className="w-6 h-6 mb-0.5" />
                <span>More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl">
              <SheetHeader className="mb-4">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                {sheetNavItems.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsSheetOpen(false)}
                    className={cn(
                      "flex items-center p-3 text-base font-medium rounded-lg",
                      isActive(to)
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </nav>
  );
};

// --- Main Navigation Component ---
const Navigation = () => {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
};

export default Navigation;
