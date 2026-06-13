import { Link, useLocation } from "react-router";
import { ThemeToggle } from "./theme/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, LogOut, User } from "lucide-react";

export function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/rankings", label: "Rankings" },
    { path: "/matches", label: "Matches" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-[#00f0ff] dark:text-[#00f0ff] text-[#3b82f6]">
            EFL League
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                location.pathname === link.path
                  ? "text-[#00f0ff] bg-[#00f0ff]/10 dark:text-[#00f0ff] dark:bg-[#00f0ff]/10 text-[#3b82f6] bg-[#3b82f6]/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-md flex items-center gap-1.5 ${
                location.pathname.startsWith("/admin")
                  ? "text-[#00f0ff] bg-[#00f0ff]/10 dark:text-[#00f0ff] dark:bg-[#00f0ff]/10 text-[#3b82f6] bg-[#3b82f6]/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="max-w-[100px] truncate">{user?.name || "User"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
