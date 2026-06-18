"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  Building,
  Plus,
  Search,
  MapPin,
  MoreVertical,
  Sprout,
  Trash2,
  X,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { createSchool, getSchools, deleteSchool } from "@/actions/schools";

interface School {
  id: string;
  name: string;
  location: string;
  regionType: "URBAN" | "RURAL";
  classrooms: number;
  students: number;
  status: "PENDING" | "VERIFIED";
  createdAt: string;
}

export default function SchoolsManagementPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    regionType: "URBAN" as "URBAN" | "RURAL",
  });

  // Load schools on mount
  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    setIsLoading(true);
    try {
      const data = await getSchools();
      setSchools(data as School[]);
    } catch (error) {
      console.error("Failed to load schools:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.location.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await createSchool(formData);
      if (result.success) {
        await loadSchools();
        setFormData({ name: "", location: "", regionType: "URBAN" });
        setShowModal(false);
      }
    } catch (error) {
      console.error("Failed to provision school:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (schoolId: string) => {
    try {
      const result = await deleteSchool(schoolId);
      if (result.success) {
        setSchools((prev) => prev.filter((s) => s.id !== schoolId));
        setDeleteConfirm(null);
        setMenuOpen(null);
      }
    } catch (error) {
      console.error("Failed to delete school:", error);
    }
  };

  const filteredSchools = schools.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen mesh-bg flex font-sans selection:bg-z-red selection:text-white pb-20">
      <Sidebar />

      <main className="flex-grow p-10 ml-72">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-white p-2 rounded-xl shadow-lg border border-zinc-100">
                <Building className="w-5 h-5 text-z-red" />
              </div>
              <h1 className="text-3xl font-black text-zinc-800 tracking-tight">
                Managed <span className="text-z-red">Schools</span>
              </h1>
            </div>
            <p className="text-zinc-600 font-medium ml-1">Deploy and monitor regional educational institutions.</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-zinc-500/20 hover:scale-[1.02] transition-all flex items-center space-x-3 group cursor-pointer"
          >
            <Plus className="w-5 h-5 text-z-red group-hover:rotate-90 transition-transform" />
            <span>Provision New School</span>
          </button>
        </header>

        {/* Search and Filters */}
        <div className="mb-8 flex space-x-4">
          <div className="relative flex-grow group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-z-red transition-colors" />
            <input
              type="text"
              placeholder="Search schools by name or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/60 backdrop-blur-md border border-zinc-100 rounded-[2rem] py-5 pl-16 pr-8 focus:outline-none focus:ring-4 focus:ring-z-red/5 focus:bg-white transition-all font-medium text-zinc-800"
            />
          </div>
          <div className="px-8 bg-white/60 backdrop-blur-md border border-zinc-100 rounded-[2rem] font-bold text-zinc-600 flex items-center">
            {schools.length} {schools.length === 1 ? "School" : "Schools"}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center bg-white/40 backdrop-blur-2xl rounded-[3rem] border border-white/50 shadow-2xl py-24 px-12 text-center">
            <Loader2 className="w-10 h-10 text-z-red animate-spin mb-4" />
            <p className="text-sm font-black text-zinc-400 uppercase tracking-widest">Loading schools...</p>
          </div>
        ) : filteredSchools.length > 0 ? (
          /* Schools Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredSchools.map((school) => (
              <div
                key={school.id}
                className="bg-white/40 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/50 shadow-2xl hover:bg-white transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-z-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className="bg-zinc-100 p-4 rounded-[1.5rem] group-hover:bg-z-red group-hover:text-white transition-all duration-500">
                      <Building className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-zinc-800 tracking-tight">{school.name}</h3>
                      <div className="flex items-center text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {school.location}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === school.id ? null : school.id)}
                      className="p-2 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-5 h-5 text-zinc-500" />
                    </button>
                    {menuOpen === school.id && (
                      <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-2xl border border-zinc-100 py-2 w-48 z-20">
                        <button
                          onClick={() => {
                            setDeleteConfirm(school.id);
                            setMenuOpen(null);
                          }}
                          className="w-full flex items-center space-x-3 px-5 py-3 text-left text-xs font-black text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete School</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8 relative z-10">
                  <div className="bg-zinc-50 p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.1em] mb-1">Classrooms</p>
                    <p className="text-lg font-black text-zinc-800">{school.classrooms}</p>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.1em] mb-1">Students</p>
                    <p className="text-lg font-black text-zinc-800">{school.students}</p>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.1em] mb-1">Region</p>
                    <p className="text-lg font-black text-zinc-800">{school.regionType === "RURAL" ? "Rural" : "Urban"}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-zinc-100 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${school.status === "VERIFIED" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}></div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      Status: <span className={school.status === "VERIFIED" ? "text-emerald-600" : "text-amber-600"}>{school.status}</span>
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {school.regionType === "RURAL" && (
                      <div className="px-3 py-1 bg-amber-100 rounded-lg flex items-center space-x-1.5" title="Rural Impact Node">
                        <Sprout className="w-3 h-3 text-amber-600" />
                        <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Rural</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delete Confirmation Overlay */}
                {deleteConfirm === school.id && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-[3rem] flex flex-col items-center justify-center z-30 p-8">
                    <Trash2 className="w-10 h-10 text-red-400 mb-4" />
                    <h4 className="text-lg font-black text-zinc-800 mb-1">Delete {school.name}?</h4>
                    <p className="text-xs text-zinc-500 font-medium mb-6">This action cannot be undone.</p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-6 py-3 bg-zinc-100 text-zinc-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(school.id)}
                        className="px-6 py-3 bg-red-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all cursor-pointer"
                      >
                        Confirm Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center bg-white/40 backdrop-blur-2xl rounded-[3rem] border border-white/50 shadow-2xl py-24 px-12 text-center">
            <div className="bg-zinc-100 p-6 rounded-[2rem] mb-6">
              <Building className="w-12 h-12 text-zinc-400" />
            </div>
            <h3 className="text-2xl font-black text-zinc-800 tracking-tight mb-2">
              {searchQuery ? "No Schools Found" : "No Schools Provisioned"}
            </h3>
            <p className="text-zinc-500 font-medium max-w-md mb-8">
              {searchQuery
                ? `No schools match "${searchQuery}". Try a different search term.`
                : "Get started by provisioning your first school or importing schools in bulk from the panel below."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowModal(true)}
                className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-zinc-500/20 hover:scale-[1.02] transition-all flex items-center space-x-3 group cursor-pointer"
              >
                <Plus className="w-5 h-5 text-z-red group-hover:rotate-90 transition-transform" />
                <span>Provision New School</span>
              </button>
            )}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-12 bg-zinc-900 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-z-red/20 to-transparent opacity-50"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <h2 className="text-3xl font-black text-white tracking-tight mb-2">Mass Provisioning Suite</h2>
              <p className="text-zinc-500 font-medium">Download CSV templates or connect your regional database for bulk school discovery.</p>
            </div>
            <div className="flex space-x-4">
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 transition-all cursor-pointer">
                Bulk Import
              </button>
              <button className="px-8 py-4 bg-z-red text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-z-red/20 hover:scale-105 transition-all cursor-pointer">
                Connect External API
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Provision Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md"
            onClick={() => !isSubmitting && setShowModal(false)}
          ></div>
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-zinc-50 flex justify-between items-center bg-zinc-50/50">
              <div className="flex items-center space-x-3">
                <div className="bg-z-red/10 p-2 rounded-xl">
                  <Building className="w-5 h-5 text-z-red" />
                </div>
                <h3 className="text-xl font-black text-zinc-800 tracking-tight">Provision New School</h3>
              </div>
              <button
                onClick={() => !isSubmitting && setShowModal(false)}
                className="p-2 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleProvision} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">School Name</label>
                <div className="relative group">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-z-red transition-colors" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. Accra Technical Academy"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-z-red/20 focus:border-z-red/50 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Location / Region</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-z-red transition-colors" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. Greater Accra, Northern Region"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-z-red/20 focus:border-z-red/50 transition-all"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Region Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, regionType: "URBAN" })}
                    className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border ${
                      formData.regionType === "URBAN"
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-lg"
                        : "bg-zinc-50 text-zinc-500 border-zinc-100 hover:bg-zinc-100"
                    }`}
                  >
                    Urban
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, regionType: "RURAL" })}
                    className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border flex items-center justify-center space-x-2 ${
                      formData.regionType === "RURAL"
                        ? "bg-amber-500 text-white border-amber-500 shadow-lg"
                        : "bg-zinc-50 text-zinc-500 border-zinc-100 hover:bg-zinc-100"
                    }`}
                  >
                    <Sprout className="w-4 h-4" />
                    <span>Rural</span>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-zinc-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>{isSubmitting ? "Provisioning..." : "Provision School"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
