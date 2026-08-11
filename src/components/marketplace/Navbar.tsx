import React from 'react';
import { ShoppingBag, Sparkles, Search, Store, Shield } from 'lucide-react';
import { ViewMode } from '../../types';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  cartCount,
  onOpenCart,
  searchQuery,
  setSearchQuery,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#6b0f1a] shadow-md border-b border-[#520912] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('marketplace')}
            className="flex items-center gap-2.5 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-white text-[#6b0f1a] flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider text-white">
                ANTIQE
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-widest text-rose-200 -mt-1">
                Print & 3D Studio
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 pl-4 border-l border-white/20">
            <button
              onClick={() => onNavigate('marketplace')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentView === 'marketplace'
                  ? 'bg-white text-[#6b0f1a] font-bold shadow-sm'
                  : 'text-rose-100 hover:text-white hover:bg-white/10'
              }`}
            >
              Marketplace
            </button>

            <button
              onClick={() => onNavigate('customizer')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                currentView === 'customizer'
                  ? 'bg-white text-[#6b0f1a] font-bold shadow-sm'
                  : 'text-rose-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-200" />
              3D Customizer
            </button>

            <button
              onClick={() => onNavigate('seller_dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                currentView === 'seller_dashboard'
                  ? 'bg-white text-[#6b0f1a] font-bold shadow-sm'
                  : 'text-rose-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Seller Hub
            </button>

            <button
              onClick={() => onNavigate('admin_dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                currentView === 'admin_dashboard'
                  ? 'bg-white text-[#6b0f1a] font-bold shadow-sm'
                  : 'text-rose-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        {currentView === 'marketplace' && (
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-200/70" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search custom mugs, vintage designs, creators..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-rose-200/60 focus:outline-none focus:bg-white focus:text-stone-900 focus:placeholder-stone-400 transition"
              />
            </div>
          </div>
        )}

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition"
            title="View Cart"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-[#6b0f1a] text-[10px] font-black flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/20">
            <div className="w-8 h-8 rounded-full bg-white text-[#6b0f1a] border border-white/40 flex items-center justify-center font-bold text-xs shadow-sm">
              MH
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
