"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { useUser } from "./UserProvider";
import { LogOut, User as UserIcon } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const { toggleTheme } = useTheme();
  const { user, role, signOut } = useUser();

  const navItems = [
    { href: "/", label: "Dashboard", roles: ["manager", "technician"] },
    { href: "/predictive-analytics", label: "Maintenance Prédictive", roles: ["manager"] },
    { href: "/calculators", label: "Calculateurs KPI", roles: ["manager"] },
    { href: "/manage-tasks", label: "Gestion Tâches", roles: ["manager"] },
    { href: "/chat", label: "Assistant IA", roles: ["manager", "technician"] },
    { href: "/documentation", label: "Documentation", roles: ["manager", "technician"] },
  ];

  const filteredNavItems = navItems.filter(item =>
    !item.roles || (role && item.roles.includes(role))
  );

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  if (!user) return null;

  return (
    <header className="fixed top-0 left-0 right-0 bg-[var(--bg)] border-b border-[var(--border)] z-50 backdrop-blur-lg">
      <nav className="max-w-[1400px] mx-auto px-8 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold text-[var(--text)] hover:text-[var(--accent)] transition-colors"
        >
          GMAO Dashboard
        </Link>

        <ul className="hidden md:flex gap-8 list-none">
          {filteredNavItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`text-sm font-medium transition-colors ${isActive(item.href)
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-light)] hover:text-[var(--accent)]"
                  }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)]">
            <UserIcon className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs font-medium text-[var(--text)] capitalize">{role}</span>
          </div>

          <button
            onClick={toggleTheme}
            className="text-xl p-2 text-[var(--text-light)] hover:text-[var(--accent)] transition-colors bg-transparent border-none cursor-pointer"
            aria-label="Toggle theme"
          >
            ◐
          </button>

          <button
            onClick={signOut}
            className="p-2 text-[var(--text-light)] hover:text-[var(--danger)] transition-colors bg-transparent border-none cursor-pointer"
            title="Se déconnecter"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>
    </header>
  );
}