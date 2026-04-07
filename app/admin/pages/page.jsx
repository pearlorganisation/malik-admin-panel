"use client";
import React from "react";
import { useGetPagesQuery, useDeletePageMutation } from "@/features/page/pageApi";
import { FileText, Plus, Trash2, ExternalLink, Edit } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function PagesListing() {
  const { data, isLoading } = useGetPagesQuery();
  const [deletePage] = useDeletePageMutation();
  const pages = data?.data || [];

  const handleDelete = async (id) => {
    if (window.confirm("Delete this page?")) {
      await deletePage(id).unwrap();
      toast.success("Page deleted");
    }
  };

  if (isLoading) return <div className="p-10 text-center font-bold">Loading CMS...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">CMS Pages</h1>
          <p className="text-slate-500 text-sm">Manage dynamic content like About Us, Privacy, etc.</p>
        </div>
        <Link href="/admin/pages/create" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
          <Plus size={18} /> Create New Page
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-[10px] font-black uppercase text-slate-400">Page Title</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-400">Slug / URL</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-400">Status</th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-400 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pages.map((page) => (
              <tr key={page._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-bold text-slate-900">{page.title}</td>
                <td className="p-4 font-mono text-xs text-blue-500">/{page.slug}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${page.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {page.status}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  <button onClick={() => handleDelete(page._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}