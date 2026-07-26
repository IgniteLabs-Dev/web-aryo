"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, Edit2, Trash2, X, Save, AlertTriangle, Filter, ExternalLink, Calendar } from "lucide-react";
import { useData, type PubCer } from "@/lib/data-provider";

export default function PubCerAdmin() {
  const { categories = [], refresh } = useData();
  const pubCerCategories = useMemo(
    () => categories.filter((c) => c.type === 'pub_cer'),
    [categories]
  );

  const [items, setItems] = useState<PubCer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<PubCer> | null>(null);
  const [filterType, setFilterType] = useState<string>("All");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await fetch("/api/pub-cer").then((r) => r.json());
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing) return;

    // Validation
    if (!editing.name?.trim() || !editing.date?.trim() || !editing.type?.trim()) {
      alert("Please fill all required fields (Type, Date, Name)");
      return;
    }

    setSaving(true);
    try {
      const method = editing.id ? "PUT" : "POST";
      const url = editing.id ? `/api/pub-cer/${editing.id}` : "/api/pub-cer";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });

      if (res.ok) {
        setEditing(null);
        await load();
        await refresh();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`/api/pub-cer/${id}`, { method: "DELETE" });
      if (res.ok) await load();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleAddNew = () => {
    setEditing({
      type: pubCerCategories[0]?.name || "Publication",
      date: "",
      name: "",
      id_journal_issuer: "",
      url: "",
    });
  };

  // Filter items by type
  const filteredItems = useMemo(() => {
    if (filterType === "All") return items;
    return items.filter((i) => i.type === filterType);
  }, [items, filterType]);

  // Group by type for summary
  const groupedByType = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach((i) => {
      map[i.type] = (map[i.type] || 0) + 1;
    });
    return map;
  }, [items]);

  // Get icon by type (smart matching)
  const getTypeIcon = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes("publication") || lower.includes("journal") || lower.includes("paper") || lower.includes("research")) {
      return "📄";
    }
    if (lower.includes("certif") || lower.includes("course") || lower.includes("training")) {
      return "🏆";
    }
    if (lower.includes("patent") || lower.includes("haki") || lower.includes("ip") || lower.includes("copyright")) {
      return "📋";
    }
    if (lower.includes("award") || lower.includes("winner")) {
      return "🥇";
    }
    return "📌";
  };

  const getTypeBadgeColor = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes("publication") || lower.includes("journal")) return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    if (lower.includes("certif") || lower.includes("course")) return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    if (lower.includes("patent") || lower.includes("haki")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    return "bg-slate-500/10 text-slate-400 border-slate-500/30";
  };

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Publications & Certifications</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your achievements and credentials</p>
        </div>
        <button
          onClick={handleAddNew}
          disabled={pubCerCategories.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-yellow text-[#030c17] font-bold hover:bg-brand-yellow-dark active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Warning kalau belum ada category */}
      {pubCerCategories.length === 0 && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-amber-400 font-semibold text-sm">No pub/cer categories yet</p>
            <p className="text-amber-300/80 text-xs mt-1">
              Add categories first at{" "}
              <a href="/secret-admin/categories" className="underline font-semibold hover:text-amber-200">
                Categories menu
              </a>{" "}
              to enable adding items.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards per Type */}
      {items.length > 0 && pubCerCategories.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <div
            onClick={() => setFilterType("All")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              filterType === "All"
                ? "bg-brand-yellow/10 border-brand-yellow/50"
                : "bg-[#0a1729] border-slate-800 hover:border-slate-600"
            }`}
          >
            <div className="text-2xl font-bold text-white">{items.length}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">All Items</div>
          </div>
          {pubCerCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setFilterType(cat.name)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                filterType === cat.name
                  ? "bg-brand-yellow/10 border-brand-yellow/50"
                  : "bg-[#0a1729] border-slate-800 hover:border-slate-600"
              }`}
            >
              <div className="text-2xl font-bold text-white">{groupedByType[cat.name] || 0}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1 truncate">{cat.name}</div>
            </div>
          ))}
        </div>
      )}

      {/* Active Filter Indicator */}
      {filterType !== "All" && (
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
          <Filter className="w-4 h-4" />
          <span>Filtered by: <span className="text-brand-yellow font-semibold">{filterType}</span></span>
          <button onClick={() => setFilterType("All")} className="text-xs text-slate-500 hover:text-white underline ml-2">
            Clear
          </button>
        </div>
      )}

      {/* Items List */}
      {loading ? (
        <div className="text-slate-500">Loading...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-[#0a1729]/30">
          {items.length === 0 ? (
            <>
              <p className="text-slate-400">No items yet.</p>
              <p className="text-slate-600 text-xs mt-1">Click "Add Item" to create one.</p>
            </>
          ) : (
            <>
              <p className="text-slate-400">No items in "{filterType}".</p>
              <button onClick={() => setFilterType("All")} className="text-xs text-brand-yellow hover:underline mt-2">
                Show all
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#0a1729] border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Type Icon */}
                  <div className="text-2xl shrink-0">{getTypeIcon(item.type)}</div>

                  <div className="flex-1 min-w-0">
                    {/* Type Badge */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border ${getTypeBadgeColor(item.type)}`}>
                        {item.type}
                      </span>
                      {item.url && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" /> Has link
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-bold leading-snug">{item.name}</h3>

                    {/* Journal/Issuer */}
                    {item.id_journal_issuer && (
                      <p className="text-sm text-slate-400 mt-1 truncate">{item.id_journal_issuer}</p>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 justify-center"
                    >
                      <ExternalLink className="w-3 h-3" /> View
                    </a>
                  )}
                  <button
                    onClick={() => setEditing(item)}
                    className="px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium flex items-center gap-1 justify-center"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-medium flex items-center gap-1 justify-center"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !saving && setEditing(null)} />
          <div className="relative w-full max-w-xl max-h-[90vh] bg-[#0a1729] border border-slate-800 rounded-2xl p-6 overflow-y-auto">
            <button
              onClick={() => setEditing(null)}
              disabled={saving}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">
              {editing.id ? "Edit" : "Add"} Publication / Certification
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Fill in the details of your achievement
            </p>

            <div className="space-y-4">
              {/* Type - DINAMIS dari database categories */}
              <div>
                <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">
                  Type <span className="text-brand-yellow">*</span>
                </label>
                {pubCerCategories.length > 0 ? (
                  <select
                    value={editing.type || ""}
                    onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 outline-none"
                  >
                    <option value="">-- Select type --</option>
                    {pubCerCategories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {getTypeIcon(c.name)} {c.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
                    ⚠ No categories available. Please add categories at{" "}
                    <a href="/secret-admin/categories" className="underline">Categories menu</a> first.
                  </div>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">
                  Date <span className="text-brand-yellow">*</span>
                </label>
                <input
                  type="text"
                  value={editing.date || ""}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  placeholder="e.g. Dec 06, 2023 or 2023-12-06"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>

              {/* Name / Title */}
              <div>
                <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">
                  Name / Title <span className="text-brand-yellow">*</span>
                </label>
                <input
                  type="text"
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Pemanfaatan IoT untuk Meningkatkan Produktivitas..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>

              {/* ID / Journal / Issuer */}
              <div>
                <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">
                  ID / Journal / Issuer
                </label>
                <input
                  type="text"
                  value={editing.id_journal_issuer || ""}
                  onChange={(e) => setEditing({ ...editing, id_journal_issuer: e.target.value })}
                  placeholder="e.g. Jurnal Abdi Insani or Reg No: 0023/RMI/..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">
                  URL <span className="text-slate-600 normal-case font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  value={editing.url || ""}
                  onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/60 focus:border-brand-yellow text-slate-100 placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => setEditing(null)}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || pubCerCategories.length === 0}
                className="flex-1 py-2.5 rounded-xl bg-brand-yellow text-[#030c17] font-bold hover:bg-brand-yellow-dark active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#030c17] border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
