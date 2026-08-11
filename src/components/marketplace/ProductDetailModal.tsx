import React from 'react';
import { X, Sparkles, Star, ShieldCheck, Truck, Coffee } from 'lucide-react';
import { Product } from '../../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onCustomize: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onCustomize,
}: ProductDetailModalProps) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row text-stone-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="w-full md:w-1/2 bg-stone-100 aspect-square relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Specs */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#6b0f1a] text-white text-[10px] font-bold">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold text-stone-800">{product.rating}</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-stone-900 leading-snug">{product.title}</h2>

            <div className="flex items-center gap-2 mt-2">
              <img
                src={product.sellerAvatar}
                alt={product.sellerName}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="text-xs text-stone-500">Designed by <strong className="text-stone-800">{product.sellerName}</strong></span>
            </div>

            <p className="mt-4 text-xs text-stone-600 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-4 space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#6b0f1a]" />
                <span>Print Area: <strong>21.0 cm × 9.5 cm Wrap</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6b0f1a]" />
                <span>Dishwasher & Microwave Safe Ceramic</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#6b0f1a]" />
                <span>Ships in 2-3 Business Days</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-stone-500 block">Unit Price</span>
              <span className="text-2xl font-black text-stone-900">${product.price.toFixed(2)}</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onCustomize(product);
              }}
              className="px-5 py-2.5 bg-[#6b0f1a] hover:bg-[#520912] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#6b0f1a]/20 flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-rose-200" />
              Customize in 3D
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
