"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, Settings, Briefcase, FolderKanban, Award, MessageSquare, LogOut, Shield, Tags } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/secret-admin/login";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/secret-admin/login");
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#030c17]">{children}</div>;
  }

  const menuItems = [
    { href: "/secret-admin", label: "Dashboard", icon: Home },
    { href: "/secret-admin/general", label: "General", icon: Settings },
    { href: "/secret-admin/services", label: "Services", icon: Briefcase },
    { href: "/secret-admin/projects", label: "Projects", icon: FolderKanban },
    { href: "/secret-admin/pub-cer", label: "Pub & Cer", icon: Award },
    { href: "/secret-admin/categories", label: "Categories", icon: Tags },
    { href: "/secret-admin/messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen bg-[#030c17]">
      <aside className="w-64 bg-[#050b14] border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-yellow/10 border border-brand-yellow/30">
            <Shield className="w-5 h-5 text-brand-yellow" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Admin Panel</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Aryo Portfolio</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? "bg-brand-yellow text-[#030c17] shadow-lg shadow-brand-yellow/10" : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="m-4 flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
