"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Save, Tags as TagsIcon } from "lucide-react";
import { useData, type Category } from "@/lib/data-provider";

type CategoryType = 'service' | 'project' | 'pub_cer';

const TYPE_LABELS: Record<CategoryType, string> = {
  service: 'Services',
  project: 'Projects',
  pub_cer: 'Pub & Cer',
};

const TYPE_BADGE: Record<CategoryType, string> = {
  service: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  project: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  pub_cer: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
};

export default function CategoriesAdmin() {
  const { categories, refresh } = useData();
  const [editing, setEditing] = useState<{ id?: number; name: string; type: CategoryType; sort_order: number } | null>(null);
  const [activeTab, setActiveTab] = useState<CategoryType>('service');

  const filtered = categories.filter((c) => c.type === activeTab);
  const grouped = {
    service: categories.filter((c) => c.type === 'service'),
    project: categories.filter((c) => c.type === 'project'),
    pub_cer: categories.filter((c) => c.type === 'pub_cer'),
  };

  const handleSave = async () => {
    if (!editing) return;
    const method = editing.id ? "PUT" : "POST";
    const url = editing.id ? `/api/categories/${editing.id}` : "/api/categories";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      setEditing(null);
      await refresh();
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to save');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) await refresh();
    else {
      const err = await res.json();
      alert(err.error || 'Failed to delete');
    }
  };

  return (
    <div className="p-8 lg:p-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Categories</h1>
          <p className="text-slate-500 text-sm mt-1">Manage categories for Services, Projects, and Pub & Cer</p>
        </div>
        <button
          onClick={() => setEditing({ name: "", type: activeTab, sort_order: 0 })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-yellow text-[#030c17] font-bold hover:bg-brand-yellow-dark active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-800">
        {(['service', 'project', 'pub_cer'] as CategoryType[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t
                ? "border-brand-yellow text-brand-yellow"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            {TYPE_LABELS[t]} <span className="text-xs text-slate-500">({grouped[t].length})</span>
          </button>
        ))}
      </div>

      {/* Category List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-[#0a1729]/30">
          <TagsIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No categories yet for {TYPE_LABELS[activeTab]}.</p>
          <p className="text-slate-600 text-xs mt-1">Click "Add Category" to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((cat) => (
            <div key={cat.id} className={`p-4 rounded-xl border bg-[#0a1729] ${TYPE_BADGE[cat.type]} flex justify-between items-center`}>
              <div>
                <div className="flex items-center gap-2">
                  <TagsIcon className="w-4 h-4" />
                  <span className="text-white font-semibold">{cat.name}</span>
                </div>
                <p className="text-[10px] text-slate-500 uppercase mt-1">Sort order: {cat.sort_order}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditing({ id: cat.id, name: cat.name, type: cat.type, sort_order: cat.sort_order })}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-md bg-[#0a1729] border border-slate-800 rounded-2xl p-6">
            <button onClick={() => setEditing(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400">
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">{editing.id ? "Edit" : "Add"} Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Type</label>
                <select
                  value={editing.type}
                  onChange={(e) => setEditing({ ...editing, type: e.target.value as CategoryType })}
                  disabled={!!editing.id}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-slate-100 outline-none disabled:opacity-50"
                >
                  <option value="service">Service</option>
                  <option value="project">Project</option>
                  <option value="pub_cer">Pub & Cer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Name</label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Finance & Accounting"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">Sort Order</label>
                <input
                  type="number"
                  value={editing.sort_order}
                  onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-medium">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-brand-yellow text-[#030c17] font-bold flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
