import React, { useState } from 'react';
import Navbar from './components/marketplace/Navbar';
import ProductGrid from './components/marketplace/ProductGrid';
import ProductDetailModal from './components/marketplace/ProductDetailModal';
import CustomizerWorkspace from './components/customizer/CustomizerWorkspace';
import CartDrawer from './components/marketplace/CartDrawer';
import CheckoutModal from './components/marketplace/CheckoutModal';
import SellerDashboard from './components/seller/SellerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { INITIAL_PRODUCTS } from './data/mockData';
import { ViewMode, Product, CartItem, Order } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('marketplace');
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation Trigger
  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
  };

  // Select Product for Quick Modal
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  // Open Product in 3D Customizer Studio
  const handleCustomizeProduct = (product: Product) => {
    setCustomizingProduct(product);
    setSelectedProduct(null);
    setCurrentView('customizer');
  };

  // Cart Management
  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased selection:bg-[#6b0f1a] selection:text-white">
      
      {/* Top Navbar (Hidden in Fullscreen Customizer Mode for maximum workspace) */}
      {currentView !== 'customizer' && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
          onOpenCart={() => setIsCartOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      {/* Main View Router */}
      <main className="w-full">
        {currentView === 'marketplace' && (
          <ProductGrid
            products={products}
            onSelectProduct={handleSelectProduct}
            onCustomizeProduct={handleCustomizeProduct}
            searchQuery={searchQuery}
          />
        )}

        {currentView === 'customizer' && (
          <CustomizerWorkspace
            onBackToMarketplace={() => setCurrentView('marketplace')}
            onAddToCart={handleAddToCart}
            initialProductType={customizingProduct?.productType || 'mug'}
          />
        )}

        {currentView === 'seller_dashboard' && (
          <SellerDashboard orders={orders} />
        )}

        {currentView === 'admin_dashboard' && (
          <AdminDashboard />
        )}
      </main>

      {/* Quick View Product Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onCustomize={handleCustomizeProduct}
      />

      {/* Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderCompleted={handleOrderCompleted}
      />
    </div>
  );
}
