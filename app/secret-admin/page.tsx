"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, FolderKanban, Award, MessageSquare, Mail, Settings, Tags } from "lucide-react";

interface Stats {
  services: number;
  projects: number;
  pubCer: number;
  unreadMessages: number;
  categories: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ services: 0, projects: 0, pubCer: 0, unreadMessages: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/services").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/pub-cer").then((r) => r.json()),
      fetch("/api/messages").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([s, p, pc, m, cat]) => {
      setStats({
        services: Array.isArray(s) ? s.length : 0,
        projects: Array.isArray(p) ? p.length : 0,
        pubCer: Array.isArray(pc) ? pc.length : 0,
        unreadMessages: Array.isArray(m) ? m.filter((x: any) => !x.is_read).length : 0,
        categories: Array.isArray(cat) ? cat.length : 0,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Services", value: stats.services, icon: Briefcase, href: "/secret-admin/services", color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30" },
    { label: "Projects", value: stats.projects, icon: FolderKanban, href: "/secret-admin/projects", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30" },
    { label: "Pub & Cer", value: stats.pubCer, icon: Award, href: "/secret-admin/pub-cer", color: "from-amber-500/20 to-yellow-500/20 border-amber-500/30" },
    { label: "Categories", value: stats.categories, icon: Tags, href: "/secret-admin/categories", color: "from-purple-500/20 to-fuchsia-500/20 border-purple-500/30" },
    { label: "Unread Messages", value: stats.unreadMessages, icon: MessageSquare, href: "/secret-admin/messages", color: "from-rose-500/20 to-pink-500/20 border-rose-500/30" },
  ];

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back! Here's an overview of your portfolio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className={`p-6 rounded-2xl bg-gradient-to-br ${c.color} border hover:scale-[1.02] active:scale-95 transition-all`}
            >
              <Icon className="w-8 h-8 text-white mb-3" />
              <div className="text-3xl font-bold text-white">{loading ? "..." : c.value}</div>
              <div className="text-xs text-slate-300 uppercase tracking-wider mt-1">{c.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/secret-admin/general" className="p-6 rounded-2xl bg-[#0a1729] border border-slate-800 hover:border-brand-yellow/50 transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-5 h-5 text-brand-yellow" />
            <h3 className="text-white font-semibold">General Settings</h3>
          </div>
          <p className="text-sm text-slate-400">Edit status note, About Me, and contact links.</p>
        </Link>

        <Link href="/secret-admin/categories" className="p-6 rounded-2xl bg-[#0a1729] border border-slate-800 hover:border-brand-yellow/50 transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <Tags className="w-5 h-5 text-brand-yellow" />
            <h3 className="text-white font-semibold">Manage Categories</h3>
          </div>
          <p className="text-sm text-slate-400">Add, edit, or delete categories for Services, Projects, and Pub & Cer.</p>
        </Link>
      </div>
    </div>
  );
}
