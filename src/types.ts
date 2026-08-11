export type ViewMode = 'marketplace' | 'customizer' | 'product_detail' | 'seller_dashboard' | 'admin_dashboard' | 'my_designs';

export type ProductType = 'mug' | 'tshirt';

export interface FabricLayer {
  id: string;
  type: 'text' | 'image' | 'rect' | 'circle' | 'path' | 'i-text';
  name: string;
  visible: boolean;
  locked: boolean;
}

export interface ColorPreset {
  id: string;
  name: string;
  color: string;
  hex: string;
  textColor: string;
}

export interface CustomizerState {
  productType: ProductType;
  mugInnerColor: string;
  mugHandleColor: string;
  mugFinish: 'glossy' | 'matte' | 'metallic_rim';
  tshirtColor: string;
  backgroundColor: string;
  showBleedLines: boolean;
  showGrid: boolean;
  cameraPreset: 'front' | 'handle' | 'back' | 'top' | '360';
  isAutoRotate: boolean;
}

export interface DesignTemplate {
  id: string;
  title: string;
  category: string;
  previewImage: string;
  fabricJson: string; // Serialized fabric canvas JSON or builder instructions
  tags: string[];
}

export interface Product {
  id: string;
  title: string;
  sellerName: string;
  sellerAvatar: string;
  sellerId: string;
  price: number;
  baseCost: number;
  rating: number;
  reviewCount: number;
  category: 'Classic Ceramic' | 'Enamel Camp' | 'Apparel' | 'Limited Edition';
  productType: ProductType;
  image: string;
  description: string;
  tags: string[];
  fabricJson?: string;
  isCustomizable: boolean;
  colors: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  productType: ProductType;
  price: number;
  quantity: number;
  color: string;
  previewUrl: string; // 3D or 2D snapshot
  printFileUrl?: string; // High-res $2100x950 PNG
  customDesignJson?: string;
  sellerName: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Pending Print' | 'In Production' | 'Shipped' | 'Delivered';
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  trackingNumber?: string;
}

export interface SellerStats {
  storeName: string;
  salesTotal: number;
  ordersCount: number;
  netProfit: number;
  activeListings: number;
  rating: number;
}
