"use client";

import { useState, useEffect } from "react";
import { 
  Users2, 
  Search, 
  Filter, 
  ShieldCheck, 
  ShieldAlert, 
  Ban, 
  CheckCircle2, 
  Edit3, 
  X, 
  GraduationCap,
  RefreshCw,
  Loader2,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveUser {
  id: string;
  name: string | null;
  email: string;
  university: string | null;
  role: "STUDENT" | "ACADEMIC_STAFF" | "UNIREPORT_ADMIN";
  createdAt: string;
  subscription: {
    tier: "FREE" | "STUDENT" | "PRO" | "INSTITUTIONAL";
    isActive: boolean;
    aiTokensUsed: number;
    projectsUsed: number;
    storageUsedMb: number;
  } | null;
  _count: {
    documents: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<LiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState<LiveUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Form state for edit modal
  const [editRole, setEditRole] = useState<string>("STUDENT");
  const [editTier, setEditTier] = useState<string>("FREE");
  const [editActive, setEditActive] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (roleFilter !== "ALL") params.append("role", roleFilter);
      if (tierFilter !== "ALL") params.append("tier", tierFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, tierFilter]);

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    const matchesSearch = 
      (u.name || "").toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.university || "").toLowerCase().includes(term);
    return matchesSearch;
  });

  const handleOpenEdit = (user: LiveUser) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditTier(user.subscription?.tier || "FREE");
    setEditActive(user.subscription?.isActive ?? true);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    try {
      setSaving(true);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          role: editRole,
          tier: editTier,
          isActive: editActive
        })
      });

      if (res.ok) {
        setFeedbackMsg(`User ${selectedUser.name || selectedUser.email} updated successfully!`);
        setIsEditModalOpen(false);
        fetchUsers();
        setTimeout(() => setFeedbackMsg(""), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user: LiveUser) => {
    const nextStatus = !(user.subscription?.isActive ?? true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          isActive: nextStatus
        })
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => {
          if (u.id === user.id) {
            return {
              ...u,
              subscription: u.subscription ? { ...u.subscription, isActive: nextStatus } : null
            };
          }
          return u;
        }));
        setFeedbackMsg(`Status for ${user.name || user.email} updated.`);
        setTimeout(() => setFeedbackMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeCount = users.filter(u => u.subscription?.isActive ?? true).length;
  const proCount = users.filter(u => u.subscription?.tier === "PRO" || u.subscription?.tier === "INSTITUTIONAL").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight">Student & Scholar Directory</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time management of student credentials, university associations, and subscription allocations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={fetchUsers} 
            variant="outline" 
            size="sm" 
            className="border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Directory
          </Button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="bg-teal-500/10 border border-teal-500/20 text-teal-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          {feedbackMsg}
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Total Registered Users</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-heading">{users.length}</span>
            <span className="text-xs font-mono text-teal-400">PostgreSQL</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Active Accounts</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400 font-heading">{activeCount}</span>
            <span className="text-xs font-mono text-emerald-400/80">Operational</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Pro & Institutional Subscribers</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-indigo-400 font-heading">{proCount}</span>
            <span className="text-xs font-mono text-indigo-400/80">Paid Tiers</span>
          </div>
        </div>
      </div>

      {/* Controls: Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/70 p-4 border border-slate-800/80 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search scholar by name, email, university..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="ACADEMIC_STAFF">Academic Staff</option>
            <option value="UNIREPORT_ADMIN">Administrator</option>
          </select>

          <select 
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Tiers</option>
            <option value="FREE">Free Tier</option>
            <option value="STUDENT">Student Plan</option>
            <option value="PRO">Research Pro</option>
            <option value="INSTITUTIONAL">Institutional</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="size-8 text-teal-400 animate-spin mb-3" />
              <p className="text-sm">Loading user directory from PostgreSQL...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center text-slate-400">
              <Users2 className="size-12 text-slate-600 mb-3" />
              <p className="text-base font-semibold text-slate-300">No users match your criteria</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                As new scholars sign up or take actions, their verified records will populate here.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/70 border-b border-slate-800/80 font-mono">
                <tr>
                  <th className="px-5 py-3.5">Scholar / Credentials</th>
                  <th className="px-5 py-3.5">University</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Subscription Tier</th>
                  <th className="px-5 py-3.5">Reports</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((user) => {
                  const isActive = user.subscription?.isActive ?? true;
                  return (
                    <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-200">{user.name || "Academic Scholar"}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-300 font-medium">
                        {user.university || "—"}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400">
                        {user.role}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          user.subscription?.tier === "PRO" 
                            ? "bg-teal-500/20 text-teal-300 border border-teal-500/30" 
                            : user.subscription?.tier === "INSTITUTIONAL" 
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        }`}>
                          {user.subscription?.tier || "FREE"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-300">
                        {user._count?.documents || 0}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                          isActive 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                          <span className={`size-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          {isActive ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenEdit(user)}
                            className="h-7 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                          >
                            <Edit3 className="size-3.5 mr-1" /> Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleToggleStatus(user)}
                            className={`h-7 text-xs ${isActive ? 'text-rose-400 hover:bg-rose-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'}`}
                          >
                            {isActive ? "Suspend" : "Activate"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <h3 className="font-semibold text-sm text-white">Edit User: {selectedUser.name || selectedUser.email}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="size-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">User Role</label>
                <select 
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="ACADEMIC_STAFF">ACADEMIC_STAFF</option>
                  <option value="UNIREPORT_ADMIN">UNIREPORT_ADMIN</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Subscription Tier</label>
                <select 
                  value={editTier}
                  onChange={(e) => setEditTier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="FREE">FREE</option>
                  <option value="STUDENT">STUDENT</option>
                  <option value="PRO">PRO</option>
                  <option value="INSTITUTIONAL">INSTITUTIONAL</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Account State</label>
                <select 
                  value={editActive ? "ACTIVE" : "SUSPENDED"}
                  onChange={(e) => setEditActive(e.target.value === "ACTIVE")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="ACTIVE">ACTIVE (Authorized)</option>
                  <option value="SUSPENDED">SUSPENDED (Locked)</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveUser} disabled={saving} className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
