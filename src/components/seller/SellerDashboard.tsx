import React from 'react';
import { Store, DollarSign, Package, TrendingUp, Download } from 'lucide-react';
import { MOCK_SELLER_STATS, MOCK_ORDERS } from '../../data/mockData';
import { Order } from '../../types';

interface SellerDashboardProps {
  orders: Order[];
}

export default function SellerDashboard({ orders }: SellerDashboardProps) {
  const allOrders = [...MOCK_ORDERS, ...orders];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-xs font-mono text-[#6b0f1a] uppercase tracking-widest font-bold">Seller Hub</span>
          <h1 className="text-2xl font-extrabold text-stone-900">{MOCK_SELLER_STATS.storeName}</h1>
          <p className="text-xs text-stone-500 mt-1">Manage print templates, download high-res print files, and track earnings.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-[#6b0f1a] text-white rounded-xl text-xs font-bold shadow-sm">
            Rating: ★ {MOCK_SELLER_STATS.rating}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-stone-500 mb-2">
            <span className="text-xs font-medium">Total Sales</span>
            <DollarSign className="w-4 h-4 text-[#6b0f1a]" />
          </div>
          <span className="text-2xl font-black text-stone-900">${MOCK_SELLER_STATS.salesTotal.toLocaleString()}</span>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-stone-500 mb-2">
            <span className="text-xs font-medium">Net Profit</span>
            <TrendingUp className="w-4 h-4 text-[#6b0f1a]" />
          </div>
          <span className="text-2xl font-black text-stone-900">${MOCK_SELLER_STATS.netProfit.toLocaleString()}</span>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-stone-500 mb-2">
            <span className="text-xs font-medium">Orders Processed</span>
            <Package className="w-4 h-4 text-[#6b0f1a]" />
          </div>
          <span className="text-2xl font-black text-stone-900">{allOrders.length + MOCK_SELLER_STATS.ordersCount}</span>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-stone-500 mb-2">
            <span className="text-xs font-medium">Active Templates</span>
            <Store className="w-4 h-4 text-[#6b0f1a]" />
          </div>
          <span className="text-2xl font-black text-stone-900">{MOCK_SELLER_STATS.activeListings}</span>
        </div>
      </div>

      {/* Print File Download & Order Fulfillment Table */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-stone-900">Incoming Print Orders & Print File Center</h2>
          <span className="text-xs text-stone-500 font-mono">21cm × 9.5cm PNG High-Res Output</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-stone-200">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#6b0f1a] text-white uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Print Preview</th>
                <th className="p-3">Status</th>
                <th className="p-3">Total</th>
                <th className="p-3 text-right">Print File Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white">
              {allOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50 transition">
                  <td className="p-3 font-mono font-bold text-[#6b0f1a]">{order.id}</td>
                  <td className="p-3">
                    <span className="font-semibold text-stone-900 block">{order.customerName}</span>
                    <span className="text-[10px] text-stone-500">{order.customerEmail}</span>
                  </td>
                  <td className="p-3">
                    {order.items[0] && (
                      <img
                        src={order.items[0].previewUrl}
                        alt="Print Preview"
                        className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200"
                      />
                    )}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6b0f1a]/10 text-[#6b0f1a] border border-[#6b0f1a]/20">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-stone-900">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-3 text-right">
                    {order.items[0]?.printFileUrl ? (
                      <a
                        href={order.items[0].printFileUrl}
                        download={`print_${order.id}_2100x950.png`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#6b0f1a] hover:bg-[#520912] text-white rounded-lg font-bold text-[11px] transition shadow-md"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Print File (PNG)
                      </a>
                    ) : (
                      <span className="text-[10px] text-stone-400 italic">Pre-designed Item</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
