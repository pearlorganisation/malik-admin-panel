"use client";
import { useState } from "react";
import { 
  useGetLanguagesQuery, 
  useAddLanguageMutation, 
  useDeleteLanguageMutation 
} from "@/features/languages/languageApi";
import { 
  Globe, Plus, Trash2, Loader2, Languages, 
  CheckCircle2, AlertCircle, Search, ChevronDown 
} from "lucide-react";
import { toast } from "react-hot-toast";

// --- Global Language Data Source ---
const GLOBAL_LANGUAGES = [
  { name: "English", code: "en" },
  { name: "Arabic", code: "ar" },
  { name: "French", code: "fr" },
  { name: "German", code: "de" },
  { name: "Spanish", code: "es" },
  { name: "Italian", code: "it" },
  { name: "Russian", code: "ru" },
  { name: "Chinese (Simplified)", code: "zh" },
  { name: "Japanese", code: "ja" },
  { name: "Hindi", code: "hi" },
  { name: "Portuguese", code: "pt" },
  { name: "Bengali", code: "bn" },
  { name: "Urdu", code: "ur" },
  { name: "Turkish", code: "tr" },
  { name: "Korean", code: "ko" },
  { name: "Persian", code: "fa" },
  { name: "Malayalam", code: "ml" },
  { name: "Tamil", code: "ta" },
  { name: "Punjabi", code: "pa" },
  { name: "Indonesian", code: "id" },
].sort((a, b) => a.name.localeCompare(b.name));

export default function LanguageManagement() {
  const [formData, setFormData] = useState({ name: "", code: "", isDefault: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(6); 

  const [addLanguage, { isLoading: isAdding }] = useAddLanguageMutation();
  const [deleteLanguage] = useDeleteLanguageMutation();
  const { data, isLoading: isFetching, isError } = useGetLanguagesQuery();

  const allActiveLanguages = data?.data || [];
  const paginatedLanguages = allActiveLanguages.slice(0, visibleCount);

  const handleSelectLanguage = (lang) => {
    setFormData({ ...formData, name: lang.name, code: lang.code });
    setSearchTerm(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return toast.error("Please select a language");

    try {
      await addLanguage(formData).unwrap();
      toast.success(`${formData.name} is now active globally!`);
      setFormData({ name: "", code: "", isDefault: false });
      setSearchTerm("");
    } catch (err) {
      const serverMsg = err?.data?.message || "";
      // Handle Duplicate Entry Error specifically
      if (serverMsg.includes("E11000")) {
        toast.error(`${formData.name} is already added.`);
      } else {
        toast.error(serverMsg || "Failed to add language");
      }
    }
  };

  const handleDelete = async (id, name, isDefault) => {
    if (isDefault) return toast.error("Default language is protected.");
    if (!window.confirm(`Remove ${name}? Activities in this language will be hidden.`)) return;

    const tId = toast.loading("Processing...");
    try {
      await deleteLanguage(id).unwrap();
      toast.success("Removed successfully", { id: tId });
    } catch (err) {
      toast.error("Operation failed", { id: tId });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-[800] text-slate-900 tracking-tight flex items-center gap-3">
              Localization <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">Pro</span>
            </h1>
            <p className="text-slate-500 font-medium">Manage multi-language content for international guests.</p>
          </div>
          
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
             <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
               <Globe className="w-4 h-4" /> {allActiveLanguages.length} Active
             </div>
          </div>
        </header>

        <div className="grid xl:grid-cols-12 gap-10">
          
          {/* LEFT: FORM SECTION */}
          <aside className="xl:col-span-4">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200/60 p-8 sticky top-10 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
              
              <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2 relative">
                <Plus className="w-6 h-6 text-blue-600" /> Configure New
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6 relative">
                <div className="space-y-2 relative">
                  <label className="text-[13px] font-bold text-slate-500 uppercase ml-1">Search Language</label>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="e.g. Arabic"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500 transition-all outline-none font-semibold text-slate-800"
                      value={searchTerm || formData.name}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    {searchTerm && (
                      <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2 backdrop-blur-xl transition-all">
                        {GLOBAL_LANGUAGES.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase())).map((lang) => (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleSelectLanguage(lang)}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl transition-colors flex justify-between items-center group/item"
                          >
                            <span className="font-bold text-slate-700 group-hover/item:text-blue-700">{lang.name}</span>
                            <span className="text-xs font-mono text-slate-400 uppercase">{lang.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-slate-500 uppercase ml-1">ISO Code</label>
                  <input
                    readOnly
                    className="w-full bg-slate-100/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-500 font-mono font-bold cursor-not-allowed"
                    value={formData.code || "Auto-detected"}
                  />
                </div>

                <div className="p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-300">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-blue-600 rounded-md cursor-pointer"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                    />
                    <div className="flex flex-col leading-tight">
                       <span className="text-sm font-bold text-slate-700">Set Primary</span>
                       <span className="text-[11px] text-slate-400">Default fallback language</span>
                    </div>
                  </label>
                </div>

                <button
                  disabled={isAdding || !formData.name}
                  className="w-full bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  {isAdding ? <Loader2 className="animate-spin w-5 h-5" /> : "Deploy Language"}
                </button>
              </form>
            </div>
          </aside>

          {/* RIGHT: TABLE SECTION */}
          <main className="xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
              
              <div className="p-8 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
                <h3 className="font-bold text-slate-800 text-lg">System Repository</h3>
              </div>

              {isFetching ? (
                <div className="flex-1 flex items-center justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>
              ) : allActiveLanguages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-40">
                  <Globe className="w-20 h-20 mb-4 stroke-[1px]" />
                  <p className="font-bold text-xl uppercase tracking-tighter">No Languages Yet</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[11px] uppercase tracking-widest font-black text-slate-400 border-b border-slate-50">
                          <th className="px-10 py-5">Language</th>
                          <th className="px-10 py-5">ISO</th>
                          <th className="px-10 py-5 text-center">Status</th>
                          <th className="px-10 py-5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {paginatedLanguages.map((lang) => (
                          <tr key={lang._id} className="group hover:bg-[#F8FAFC]/50 transition-all duration-300">
                            <td className="px-10 py-7">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center font-black text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                    {lang.code.toUpperCase()}
                                  </div>
                                  <span className="font-bold text-slate-900 text-lg tracking-tight">{lang.name}</span>
                               </div>
                            </td>
                            <td className="px-10 py-7">
                               <span className="font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg text-sm">{lang.code}</span>
                            </td>
                            <td className="px-10 py-7 text-center">
                               {lang.isDefault ? (
                                 <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 text-[11px] font-black rounded-full border border-emerald-100 uppercase">
                                   <CheckCircle2 className="w-3.5 h-3.5" /> Primary
                                 </span>
                               ) : (
                                 <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                               )}
                            </td>
                            <td className="px-10 py-7 text-right">
                               <button 
                                 onClick={() => handleDelete(lang._id, lang.name, lang.isDefault)}
                                 className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                               >
                                 <Trash2 className="w-5 h-5" />
                               </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {visibleCount < allActiveLanguages.length && (
                    <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex justify-center mt-auto">
                       <button 
                         onClick={() => setVisibleCount(v => v + 6)}
                         className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                       >
                         Show More <ChevronDown className="w-4 h-4" />
                       </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}