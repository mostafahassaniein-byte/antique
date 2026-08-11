import React, { useState } from 'react';
import { Star, Sparkles, Eye, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { Product } from '../../types';

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onCustomizeProduct: (product: Product) => void;
  searchQuery: string;
}

export default function ProductGrid({
  products,
  onSelectProduct,
  onCustomizeProduct,
  searchQuery,
}: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Classic Ceramic', 'Enamel Camp', 'Apparel', 'Limited Edition'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-white border-b border-stone-200 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#6b0f1a]/10 border border-[#6b0f1a]/20 rounded-full text-[#6b0f1a] text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#6b0f1a]" />
              Real-time 3D WebGL Print Customization Studio
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-stone-900 leading-tight">
              Design & Print <span className="text-[#6b0f1a]">Custom Mugs</span> in Live 3D
            </h1>

            <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
              Experience the world’s most advanced print-on-demand customizer. Craft 21 cm × 9.5 cm wrap artwork on Fabric.js and watch your design render on a 3D ceramic mug instantly.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => onCustomizeProduct(products[0])}
                className="px-6 py-3 bg-[#6b0f1a] hover:bg-[#520912] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#6b0f1a]/20 flex items-center gap-2 transition group"
              >
                <Sparkles className="w-4 h-4 text-rose-200 group-hover:rotate-12 transition-transform" />
                Open 3D Customizer Studio
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hero Feature Badges */}
          <div className="grid grid-cols-2 gap-3 shrink-0 max-w-sm">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col gap-2">
              <ShieldCheck className="w-6 h-6 text-[#6b0f1a]" />
              <span className="font-bold text-sm text-stone-900">300 DPI Export</span>
              <span className="text-xs text-stone-500">Crisp high-resolution print ready PNG files.</span>
            </div>
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col gap-2">
              <RefreshCw className="w-6 h-6 text-[#6b0f1a]" />
              <span className="font-bold text-sm text-stone-900">sRGB Accurate</span>
              <span className="text-xs text-stone-500">1:1 color space match between editor & 3D.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Category Filter Tabs */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-8 overflow-x-auto gap-2">
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-[#6b0f1a] text-white shadow-md'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-stone-500 font-mono hidden sm:inline">
            Showing {filteredProducts.length} items
          </span>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-[#6b0f1a] hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Product Thumbnail Container */}
              <div className="relative aspect-square overflow-hidden bg-stone-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Seller Avatar Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-stone-200 flex items-center gap-1.5 text-xs text-stone-800 shadow-sm">
                  <img
                    src={product.sellerAvatar}
                    alt={product.sellerName}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span className="truncate max-w-[100px] font-semibold text-[11px] text-stone-800">{product.sellerName}</span>
                </div>

                {/* Category Badge */}
                <span className="absolute top-3 right-3 bg-[#6b0f1a] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                  {product.productType === 'mug' ? '21x9.5 cm' : 'T-Shirt'}
                </span>

                {/* Quick 3D View Overlay Button */}
                <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 gap-2">
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-lg"
                  >
                    <Eye className="w-3.5 h-3.5 text-rose-300" />
                    Quick View
                  </button>
                  <button
                    onClick={() => onCustomizeProduct(product)}
                    className="px-3 py-2 bg-[#6b0f1a] hover:bg-[#520912] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Customize
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span className="font-bold text-stone-800">{product.rating}</span>
                    <span className="text-stone-400 text-[10px]">({product.reviewCount})</span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-sm line-clamp-1 group-hover:text-[#6b0f1a] transition-colors">
                    {product.title}
                  </h3>

                  <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Price</span>
                    <span className="font-extrabold text-base text-stone-900">${product.price.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => onCustomizeProduct(product)}
                    className="px-3 py-1.5 bg-[#6b0f1a]/10 hover:bg-[#6b0f1a] text-[#6b0f1a] hover:text-white border border-[#6b0f1a]/30 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Sparkles className="w-3 h-3" />
                    Customize 3D
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
