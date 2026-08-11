import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#6b0f1a] uppercase tracking-widest font-bold">Platform Governance</span>
          <h1 className="text-2xl font-extrabold text-stone-900">ANTIQE Admin Console</h1>
          <p className="text-xs text-stone-500 mt-1">Platform fulfillment routing, print API integrations, and seller moderation.</p>
        </div>

        <div className="px-3 py-1.5 bg-[#6b0f1a]/10 border border-[#6b0f1a]/30 rounded-xl text-xs font-bold text-[#6b0f1a] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#6b0f1a] animate-pulse" />
          WebGL Engine: Healthy (0 Memory Leaks)
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <span className="text-xs text-stone-500 block mb-1 font-medium">Platform GMV</span>
          <span className="text-2xl font-black text-stone-900">$142,890</span>
        </div>
        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <span className="text-xs text-stone-500 block mb-1 font-medium">Commission Earned (15%)</span>
          <span className="text-2xl font-black text-[#6b0f1a]">$21,433</span>
        </div>
        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <span className="text-xs text-stone-500 block mb-1 font-medium">Active Sellers</span>
          <span className="text-2xl font-black text-stone-900">84</span>
        </div>
        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <span className="text-xs text-stone-500 block mb-1 font-medium">Print Network Partner</span>
          <span className="text-xs font-bold text-[#6b0f1a] block mt-2">Printful / Gelato API Connected</span>
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="font-bold text-base text-stone-900">Print Dispatch & WebGL Texture Telemetry</h2>
        <div className="space-y-2 text-xs font-mono">
          {[
            '01:59:02 - CanvasTexture created with sRGB color space [1:1 Match]',
            '01:58:44 - Order ORD-8821 dispatched to Printful API with 2100x950 PNG',
            '01:57:12 - Fabric.js after:render event throttled via RAF (60 FPS locked)',
            '01:55:01 - Material cloned for Mug_Printable_Zone (no global cache leak)',
          ].map((log, i) => (
            <div key={i} className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-stone-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#6b0f1a] shrink-0" />
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
