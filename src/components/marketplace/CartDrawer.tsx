import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onProceedToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onUpdateQuantity,
  onProceedToCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 text-stone-900 flex flex-col shadow-2xl relative z-10">
          
          {/* Header */}
          <div className="p-4 bg-[#6b0f1a] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-white" />
              <h2 className="font-bold text-sm text-white">Your Cart ({cart.length})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-rose-100 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-stone-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#6b0f1a]" />
                <p className="text-sm font-semibold text-stone-700">Your cart is empty</p>
                <p className="text-xs mt-1 text-stone-500">Design a custom mug or select items from marketplace.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex gap-3 items-center"
                >
                  <img
                    src={item.previewUrl}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover bg-white shrink-0 border border-stone-200"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-stone-900 truncate">{item.title}</h4>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      Seller: {item.sellerName}
                    </span>
                    <span className="text-xs font-black text-[#6b0f1a] block mt-1">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-stone-400 hover:text-[#6b0f1a] p-1 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-900 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-stone-900">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-900 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-3">
              <div className="flex justify-between text-xs text-stone-600">
                <span>Subtotal</span>
                <span className="text-stone-900 font-mono font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-600">
                <span>Print & Fulfillment</span>
                <span className="text-[#6b0f1a] font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full py-3 bg-[#6b0f1a] hover:bg-[#520912] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#6b0f1a]/20 flex items-center justify-center gap-2 transition"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
