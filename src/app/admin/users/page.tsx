"use client";

import { useState } from "react";
import { 
  Users2, 
  Search, 
  Filter, 
  Download, 
  UserPlus, 
  MoreVertical, 
  ShieldCheck, 
  ShieldAlert, 
  Ban, 
  CheckCircle2, 
  Edit3, 
  X, 
  GraduationCap,
  Key
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserItem {
  id: string;
  name: string;
  email: string;
  university: string;
  role: "STUDENT" | "ACADEMIC_STAFF" | "UNIREPORT_ADMIN";
  tier: "FREE" | "STUDENT" | "PRO" | "INSTITUTIONAL";
  status: "Active" | "Suspended";
  joinedDate: string;
  tokensUsed: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([
    { id: "usr_01", name: "Amani Kiboko", email: "amani.k@udsm.ac.tz", university: "UDSM", role: "STUDENT", tier: "PRO", status: "Active", joinedDate: "2026-10-01", tokensUsed: 42300 },
    { id: "usr_02", name: "Fatma Othman", email: "f.othman@sua.ac.tz", university: "SUA", role: "STUDENT", tier: "PRO", status: "Active", joinedDate: "2026-10-03", tokensUsed: 89100 },
    { id: "usr_03", name: "Baraka Mushi", email: "bmushi@udom.ac.tz", university: "UDOM", role: "STUDENT", tier: "FREE", status: "Suspended", joinedDate: "2026-10-05", tokensUsed: 1200 },
    { id: "usr_04", name: "Dr. Lilian Ngowi", email: "lngowi@muhas.ac.tz", university: "MUHAS", role: "ACADEMIC_STAFF", tier: "INSTITUTIONAL", status: "Active", joinedDate: "2026-10-08", tokensUsed: 145000 },
    { id: "usr_05", name: "Geofrey Masanja", email: "masanja@dit.ac.tz", university: "DIT", role: "STUDENT", tier: "STUDENT", status: "Active", joinedDate: "2026-10-09", tokensUsed: 15400 },
    { id: "usr_06", name: "System Administrator", email: "admin@unireport.tz", university: "HQ", role: "UNIREPORT_ADMIN", tier: "INSTITUTIONAL", status: "Active", joinedDate: "2026-09-15", tokensUsed: 312000 },
  ]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.university.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesTier = tierFilter === "ALL" || u.tier === tierFilter;
    return matchesSearch && matchesRole && matchesTier;
  });

  const toggleStatus = (id: string) => {
    setUsers(users.map((u) => {
      if (u.id === id) {
        const newStatus = u.status === "Active" ? "Suspended" : "Active";
        setFeedbackMsg(`User ${u.name} status updated to ${newStatus}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
    setTimeout(() => setFeedbackMsg(""), 3000);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    setIsEditModalOpen(false);
    setFeedbackMsg(`User ${selectedUser.name} saved successfully.`);
    setTimeout(() => setFeedbackMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
            <Users2 className="size-6 text-teal-400" />
            User & Access Management
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Administer scholar credentials, academic roles, and usage allowances.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
            onClick={() => alert("CSV export triggered. File downloading...")}
          >
            <Download className="size-3.5 mr-1.5" /> Export Records
          </Button>
          <Button 
            size="sm" 
            className="text-xs bg-teal-500 text-slate-950 hover:bg-teal-400 font-semibold"
            onClick={() => {
              const newUser: UserItem = {
                id: `usr_${Date.now()}`,
                name: "New Student",
                email: "new.student@udsm.ac.tz",
                university: "UDSM",
                role: "STUDENT",
                tier: "FREE",
                status: "Active",
                joinedDate: new Date().toISOString().split("T")[0],
                tokensUsed: 0
              };
              setUsers([newUser, ...users]);
              setSelectedUser(newUser);
              setIsEditModalOpen(true);
            }}
          >
            <UserPlus className="size-3.5 mr-1.5" /> Add User
          </Button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-xs text-teal-300 flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          {feedbackMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="size-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search student name, email, university..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="size-3.5 text-slate-500" />
            <span>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-8 px-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Roles</option>
              <option value="STUDENT">Student</option>
              <option value="ACADEMIC_STAFF">Staff / Supervisor</option>
              <option value="UNIREPORT_ADMIN">Administrator</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Tier:</span>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="h-8 px-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Tiers</option>
              <option value="FREE">Free</option>
              <option value="STUDENT">Student</option>
              <option value="PRO">Pro</option>
              <option value="INSTITUTIONAL">Institutional</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/70 border-b border-slate-800 font-mono">
              <tr>
                <th className="px-5 py-3.5">User Identity</th>
                <th className="px-5 py-3.5">University</th>
                <th className="px-5 py-3.5">System Role</th>
                <th className="px-5 py-3.5">Subscription Tier</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Tokens Used</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                    No users match your active search filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-200">{user.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {user.university}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        user.role === "UNIREPORT_ADMIN" 
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" 
                          : user.role === "ACADEMIC_STAFF"
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          : "bg-slate-800 text-slate-300"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        user.tier === "PRO" 
                          ? "bg-teal-500/20 text-teal-300 border border-teal-500/30" 
                          : user.tier === "INSTITUTIONAL"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}>
                        {user.tier}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 font-medium ${
                        user.status === "Active" ? "text-emerald-400" : "text-rose-400"
                      }`}>
                        <span className={`size-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-400" : "bg-rose-400"}`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-400">
                      {user.tokensUsed.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit User"
                        >
                          <Edit3 className="size-3.5" />
                        </button>
                        <button
                          onClick={() => toggleStatus(user.id)}
                          className={`p-1.5 rounded transition-colors ${
                            user.status === "Active" 
                              ? "text-rose-400 hover:bg-rose-950/40" 
                              : "text-emerald-400 hover:bg-emerald-950/40"
                          }`}
                          title={user.status === "Active" ? "Suspend Account" : "Reactivate Account"}
                        >
                          {user.status === "Active" ? <Ban className="size-3.5" /> : <CheckCircle2 className="size-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-3.5 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Showing {filteredUsers.length} of {users.length} registered accounts</span>
          <span className="font-mono">Audit policy: ISO-27001 compliant</span>
        </div>
      </div>

      {/* Edit User Modal Dialog */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="size-4 text-teal-400" /> Edit Scholar Account
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">System Role</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as any })}
                    className="w-full h-9 px-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="ACADEMIC_STAFF">ACADEMIC_STAFF</option>
                    <option value="UNIREPORT_ADMIN">UNIREPORT_ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Subscription Tier</label>
                  <select
                    value={selectedUser.tier}
                    onChange={(e) => setSelectedUser({ ...selectedUser, tier: e.target.value as any })}
                    className="w-full h-9 px-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="FREE">FREE</option>
                    <option value="STUDENT">STUDENT</option>
                    <option value="PRO">PRO</option>
                    <option value="INSTITUTIONAL">INSTITUTIONAL</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="bg-teal-500 text-slate-950 hover:bg-teal-400 font-semibold"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
