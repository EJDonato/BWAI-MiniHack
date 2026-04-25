"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Settings, 
  Download, 
  Info,
  Building2,
  ClipboardList,
  Wand2,
  History,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileUp,
  FileCheck
} from "lucide-react";
import { generateBlotterDoc } from "@/lib/docx-generator";
import { fillBlotterTemplate } from "@/lib/docx-templater";

interface BlotterData {
  complainant: string;
  respondent: string;
  natureOfComplaint: string;
  formalSummary: string;
  incidentDate: string;
  incidentLocation: string;
}

export default function Home() {
  const [template, setTemplate] = useState({
    barangayName: "",
    city: "",
    province: "",
    customInstructions: ""
  });

  const [isDragging, setIsDragging] = useState(false);
  const [customTemplate, setCustomTemplate] = useState<{ buffer: ArrayBuffer; name: string } | null>(null);
  const [complaint, setComplaint] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BlotterData | null>(null);
  const [activeTab, setActiveTab] = useState<"generator" | "settings">("generator");

  useEffect(() => {
    const saved = localStorage.getItem("lupon_template");
    if (saved) {
      setTemplate(JSON.parse(saved));
    }
  }, []);

  const saveTemplate = () => {
    localStorage.setItem("lupon_template", JSON.stringify(template));
    alert("Profile Updated Successfully");
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith(".docx")) {
      alert("Please upload a .docx file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result instanceof ArrayBuffer) {
        setCustomTemplate({
          buffer: event.target.result,
          name: file.name
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleGenerate = async () => {
    if (!complaint) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/generate-blotter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaint,
          customInstructions: template.customInstructions
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    
    if (customTemplate) {
      await fillBlotterTemplate(customTemplate.buffer, result, template);
    } else {
      await generateBlotterDoc(result, template);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100">
      {/* Top Banner - "Official" Look */}
      <div className="bg-[#002147] text-white py-2 px-6 text-[10px] font-bold tracking-[0.2em] uppercase flex justify-center items-center gap-4 border-b border-white/10">
        <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-blue-400" /> Republic of the Philippines</span>
        <span className="opacity-30">|</span>
        <span className="flex items-center gap-1.5">Katarungang Pambarangay System</span>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-[#002D62] p-2.5 rounded-xl shadow-inner">
              <FileText className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#002D62] leading-none tracking-tight">LUPON-BOT <span className="text-blue-500 text-sm font-medium ml-1">v2.0</span></h1>
              <p className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">Automated Blotter Generation Engine</p>
            </div>
          </div>
          
          <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setActiveTab("generator")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "generator" ? "bg-white text-[#002D62] shadow-sm ring-1 ring-black/5" : "text-slate-500 hover:text-slate-800"}`}
            >
              <Wand2 className="w-4 h-4" />
              Generator
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "settings" ? "bg-white text-[#002D62] shadow-sm ring-1 ring-black/5" : "text-slate-500 hover:text-slate-800"}`}
            >
              <Settings className="w-4 h-4" />
              Barangay Profile
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-10">
        {activeTab === "settings" ? (
          <div className="max-w-4xl mx-auto transition-all duration-500">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden">
              <div className="bg-[#002D62] p-8 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-6 h-6 text-blue-300" />
                  <h2 className="text-2xl font-bold">Local Authority Profile</h2>
                </div>
                <p className="text-blue-100/60 text-sm">Configure your barangay's specific details for document headers.</p>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Barangay Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. San Lorenzo"
                      value={template.barangayName}
                      onChange={(e) => setTemplate({...template, barangayName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">City / Municipality</label>
                    <input 
                      type="text"
                      placeholder="e.g. Makati City"
                      value={template.city}
                      onChange={(e) => setTemplate({...template, city: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Province</label>
                    <input 
                      type="text"
                      placeholder="e.g. Metro Manila"
                      value={template.province}
                      onChange={(e) => setTemplate({...template, province: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Custom AI Directives</label>
                    <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-1 rounded font-bold border border-amber-100 flex items-center gap-1">
                      <Wand2 className="w-3 h-3" /> Advanced Setting
                    </span>
                  </div>
                  <textarea 
                    rows={4}
                    placeholder="Instructions for the AI (e.g. 'Use extremely formal Tagalog', 'Refer to parties as Nagsusumbong and Inirereklamo')"
                    value={template.customInstructions}
                    onChange={(e) => setTemplate({...template, customInstructions: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Custom .DOCX Template (Optional)</label>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold border border-blue-100 flex items-center gap-1">
                      <FileUp className="w-3 h-3" /> Personalize
                    </span>
                  </div>
                  
                  <div className="relative">
                    {!customTemplate ? (
                      <div 
                        className="relative group"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <input 
                          type="file" 
                          accept=".docx"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        <div className={`w-full px-6 py-10 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 ${isDragging ? 'border-blue-500 bg-blue-100/50 scale-[1.02]' : 'border-slate-200 bg-slate-50/50 group-hover:border-blue-300 group-hover:bg-blue-50/30'}`}>
                          <div className={`p-3 rounded-xl shadow-sm border transition-all ${isDragging ? 'bg-blue-500 border-blue-600 scale-110' : 'bg-white border-slate-100 group-hover:scale-110'}`}>
                            <Upload className={`w-6 h-6 ${isDragging ? 'text-white' : 'text-slate-400'}`} />
                          </div>
                          <div className="text-center">
                            <p className={`text-sm font-bold ${isDragging ? 'text-blue-700' : 'text-slate-600'}`}>
                              {isDragging ? 'Drop it here!' : 'Click to browse or drag your .docx here'}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Placeholders: {'{complainant}'}, {'{respondent}'}, {'{formalSummary}'}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full px-6 py-8 rounded-2xl border-2 border-emerald-200 bg-emerald-50/30 flex flex-col items-center justify-center gap-3">
                        <div className="bg-emerald-500 p-3 rounded-full shadow-lg shadow-emerald-200">
                          <FileCheck className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-emerald-900">{customTemplate.name}</p>
                          <p className="text-xs text-emerald-600 font-medium mt-1 uppercase tracking-wider">Custom Template Active</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setCustomTemplate(null)}
                          className="mt-2 px-4 py-1.5 bg-white border border-red-100 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-full shadow-sm transition-all uppercase tracking-widest"
                        >
                          Remove Template
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={saveTemplate}
                  className="w-full bg-[#002D62] hover:bg-[#003d85] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Save and Apply Profile
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6 transition-all duration-500">
            {/* Incident Narrative Input */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">Incident Narrative</h2>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <History className="w-3 h-3" /> Raw Input
                </div>
              </div>
              
              <div className="p-6">
                <textarea 
                  rows={12}
                  placeholder="Paki-type o i-paste ang detalye ng reklamo dito... (e.g. 'Kaninang umaga bandang 8am, nag-away kami ni Cardo dahil sa parking...')"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl bg-slate-50/50 border-2 border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-slate-700 leading-relaxed font-medium placeholder:text-slate-400"
                />
                
                <div className="mt-6 space-y-4">
                  <button 
                    onClick={handleGenerate}
                    disabled={loading || !complaint}
                    className="w-full bg-[#002D62] hover:bg-[#003d85] disabled:bg-slate-200 disabled:text-slate-400 text-white px-6 py-5 rounded-2xl font-black shadow-xl shadow-blue-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        <span className="tracking-wide">AI IS PROCESSING...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 text-blue-300 group-hover:rotate-12 transition-transform" />
                        <span className="tracking-wide uppercase">Extract & Formalize Report</span>
                      </>
                    )}
                  </button>

                  {result && (
                    <button 
                      onClick={handleDownload}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-5 rounded-2xl font-black shadow-xl shadow-emerald-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                      <Download className="w-5 h-5" />
                      <span className="tracking-wide uppercase">Download Formalized DOCX</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {result && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center justify-between animate-in fade-in zoom-in duration-500">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500 p-2.5 rounded-xl shadow-lg shadow-emerald-200">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-900 text-base">Generation Complete!</p>
                    <p className="text-sm text-emerald-700">The report for <span className="font-bold underline">{result.complainant}</span> is ready for download.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20 flex gap-4">
              <div className="bg-white/20 p-2 rounded-lg h-fit">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sm">Automated Legal Filtering</p>
                <p className="text-xs text-blue-100 leading-relaxed opacity-90">
                  Our AI automatically removes emotional expletives and non-essential dialogue, focusing only on the legal facts of the incident.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-[1600px] mx-auto px-6 py-12 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-40 grayscale">
            <ShieldCheck className="w-5 h-5" />
            <p className="text-xs font-bold tracking-widest uppercase">LUPON-BOT SECURITY CORE</p>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Official Administrative Support System • v2.0.4
          </p>
        </div>
      </footer>
    </div>
  );
}
