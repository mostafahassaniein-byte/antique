import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, CreditCard } from 'lucide-react';
import { CartItem, Order } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderCompleted: (order: Order) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  onOrderCompleted,
}: CheckoutModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [formData, setFormData] = useState({
    name: 'Mostafa Hassaniein',
    email: 'mostafahassaniein@gmail.com',
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    zip: '97477',
  });

  if (!isOpen) return null;

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: formData.name,
      customerEmail: formData.email,
      items: cart,
      totalAmount: total,
      status: 'Pending Print',
      createdAt: new Date().toISOString(),
      shippingAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: 'United States',
      },
      trackingNumber: `ANT-${Math.floor(10000000 + Math.random() * 90000000)}-US`,
    };

    setCompletedOrder(newOrder);
    setIsSuccess(true);
    onOrderCompleted(newOrder);

    // Fire Confetti!
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative text-stone-900">
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess && completedOrder ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#6b0f1a]/10 text-[#6b0f1a] rounded-full flex items-center justify-center mx-auto border border-[#6b0f1a]/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-stone-900">Order Sent to Print Queue!</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Order ID: <strong className="text-[#6b0f1a]">{completedOrder.id}</strong>. Your custom print file has been dispatched to the production partner.
            </p>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Tracking Code</span>
                <span className="font-mono text-[#6b0f1a] font-bold">{completedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Items</span>
                <span className="font-medium text-stone-800">{completedOrder.items.length} Custom Print Item(s)</span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Paid</span>
                <span>${completedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#6b0f1a] hover:bg-[#520912] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#6b0f1a]/20 transition"
            >
              Return to Marketplace
            </button>
          </div>
        ) : (
          <div>
            <div className="p-4 bg-[#6b0f1a] text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-white" />
              <h2 className="font-bold text-base text-white">Checkout & Print Fulfillment</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-[#6b0f1a]"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-[#6b0f1a]"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Shipping Address</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-[#6b0f1a]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-[#6b0f1a]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-[#6b0f1a]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Zip Code</label>
                    <input
                      type="text"
                      required
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-[#6b0f1a]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 block">Total Due</span>
                  <span className="text-xl font-black text-stone-900">${total.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#6b0f1a] hover:bg-[#520912] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#6b0f1a]/20 flex items-center gap-2 transition"
                >
                  Pay & Dispatch Order (${total.toFixed(2)})
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
