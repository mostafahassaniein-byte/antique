import React, { useState, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as fabric from 'fabric';
import { 
  Download, ShoppingBag, 
  ArrowLeft, RefreshCw, Shirt, Coffee, Eye, Sparkles
} from 'lucide-react';
import FabricEditor from './FabricEditor';
import MugModel from '../3d/MugModel';
import TShirtModel from '../3d/TShirtModel';
import StudioLighting from '../3d/StudioLighting';
import { useCanvasTexture } from '../../hooks/useCanvasTexture';
import { ProductType, CartItem } from '../../types';
import { MUG_INNER_COLORS } from '../../data/mockData';

interface CustomizerWorkspaceProps {
  onBackToMarketplace: () => void;
  onAddToCart: (item: CartItem) => void;
  initialProductType?: ProductType;
}

export default function CustomizerWorkspace({
  onBackToMarketplace,
  onAddToCart,
  initialProductType = 'mug',
}: CustomizerWorkspaceProps) {
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [productType, setProductType] = useState<ProductType>(initialProductType);
  
  // Customizer styling options
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [mugInnerColor, setMugInnerColor] = useState('#ffffff');
  const [mugHandleColor, setMugHandleColor] = useState('#ffffff');
  const [mugFinish, setMugFinish] = useState<'glossy' | 'matte' | 'metallic_rim'>('glossy');
  const [tshirtColor, setTshirtColor] = useState('#ffffff');
  
  // Guide overlays
  const [showBleedLines, setShowBleedLines] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  
  // 3D Controls
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const orbitControlsRef = useRef<any>(null);

  // Auto reset camera to front view when switching products
  React.useEffect(() => {
    setCameraAngle('front');
  }, [productType]);

  // Bridges Fabric.js 2D canvas to 3D CanvasTexture in real time
  const canvasTexture = useCanvasTexture(fabricCanvas);

  // Camera angle presets
  const setCameraAngle = (angle: 'front' | 'handle' | 'back' | 'top') => {
    setIsAutoRotate(false);
    if (!orbitControlsRef.current) return;

    if (angle === 'front') {
      orbitControlsRef.current.object.position.set(0, 0, 3);
    } else if (angle === 'handle') {
      orbitControlsRef.current.object.position.set(-2.5, 0.5, -1.8);
    } else if (angle === 'back') {
      orbitControlsRef.current.object.position.set(0, 0, -3);
    } else if (angle === 'top') {
      orbitControlsRef.current.object.position.set(0, 3, 0.1);
    }
    orbitControlsRef.current.target.set(0, 0, 0);
    orbitControlsRef.current.update();
  };

  // Export High-Res PNG print file
  const handleExportPNG = useCallback(() => {
    if (!fabricCanvas) return;

    fabricCanvas.discardActiveObject();
    fabricCanvas.requestRenderAll();

    const dataUrl = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1.0,
      multiplier: 2.5, // 2100x950 resolution
    });

    const link = document.createElement('a');
    link.download = `antiqe_custom_${productType}_print_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, [fabricCanvas, productType]);

  // Add Custom Product to Cart
  const handleAddToCartClick = useCallback(() => {
    if (!fabricCanvas) return;

    fabricCanvas.discardActiveObject();
    fabricCanvas.requestRenderAll();

    const printFileUrl = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1.0,
      multiplier: 1.5,
    });

    const cartItem: CartItem = {
      id: `custom-${Date.now()}`,
      productId: `custom-${productType}`,
      title: productType === 'mug' ? 'Custom Printed 11oz Ceramic Mug' : 'Custom Printed Organic Cotton Tee',
      productType,
      price: productType === 'mug' ? 19.50 : 34.00,
      quantity: 1,
      color: productType === 'mug' ? mugInnerColor : tshirtColor,
      previewUrl: printFileUrl,
      printFileUrl,
      customDesignJson: JSON.stringify(fabricCanvas.toJSON()),
      sellerName: 'Your Custom Creation',
    };

    onAddToCart(cartItem);
  }, [fabricCanvas, productType, mugInnerColor, tshirtColor, onAddToCart]);

  return (
    <div className="flex flex-col min-h-screen bg-stone-100 text-stone-900 font-sans">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 h-14 bg-[#6b0f1a] text-white border-b border-[#520912] px-4 flex items-center justify-between z-30 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMarketplace}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Marketplace
          </button>
          
          <div className="h-4 w-px bg-white/20 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-wider text-white">ANTIQE</span>
            <span className="text-xs text-rose-200 font-medium hidden sm:inline">Custom Studio</span>
          </div>
        </div>

        {/* Product Switcher */}
        <div className="flex items-center bg-black/20 p-1 rounded-xl border border-white/20">
          <button
            onClick={() => setProductType('mug')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition ${
              productType === 'mug' ? 'bg-white text-[#6b0f1a] shadow' : 'text-rose-100 hover:text-white'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            Ceramic Mug
          </button>
          <button
            onClick={() => setProductType('tshirt')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition ${
              productType === 'tshirt' ? 'bg-white text-[#6b0f1a] shadow' : 'text-rose-100 hover:text-white'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            T-Shirt
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPNG}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-bold transition"
            title="Download high-resolution 300 DPI print file"
          >
            <Download className="w-3.5 h-3.5 text-rose-200" />
            Export PNG
          </button>

          <button
            onClick={handleAddToCartClick}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-white hover:bg-rose-50 text-[#6b0f1a] rounded-lg text-xs font-extrabold shadow-md transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Cart (${productType === 'mug' ? '19.50' : '34.00'})
          </button>
        </div>
      </header>

      {/* Main Studio Body: Stacked Vertical Layout */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 space-y-6 max-w-6xl mx-auto w-full">
        
        {/* SECTION 1: 3D REAL-TIME PRODUCT MODEL STAGE (VISIBLE ABOVE THE CANVAS) */}
        <section className="bg-white border border-stone-200 rounded-3xl shadow-md overflow-hidden relative flex flex-col">
          
          {/* Section Header & Viewport Overlay Controls */}
          <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 z-10">
            
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#6b0f1a]" />
              <span className="font-extrabold text-xs text-stone-900 uppercase tracking-wider">
                3D Real-time Mug Preview
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE SYNCED
              </span>
            </div>

            {/* 3D Camera Angles Bar */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200 shadow-sm text-xs">
              <span className="text-[10px] font-bold text-stone-400 px-1 uppercase tracking-wider">Angle</span>
              <button
                onClick={() => setCameraAngle('front')}
                className="px-2.5 py-1 bg-stone-100 hover:bg-[#6b0f1a] text-stone-700 hover:text-white rounded-lg font-bold transition"
              >
                Front
              </button>
              <button
                onClick={() => setCameraAngle('handle')}
                className="px-2.5 py-1 bg-stone-100 hover:bg-[#6b0f1a] text-stone-700 hover:text-white rounded-lg font-bold transition"
              >
                Handle
              </button>
              <button
                onClick={() => setCameraAngle('back')}
                className="px-2.5 py-1 bg-stone-100 hover:bg-[#6b0f1a] text-stone-700 hover:text-white rounded-lg font-bold transition"
              >
                Back
              </button>
              <button
                onClick={() => setCameraAngle('top')}
                className="px-2.5 py-1 bg-stone-100 hover:bg-[#6b0f1a] text-stone-700 hover:text-white rounded-lg font-bold transition"
              >
                Top
              </button>
              <button
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                  isAutoRotate ? 'bg-[#6b0f1a] text-white shadow-sm' : 'bg-stone-100 text-stone-600'
                }`}
                title="Toggle 360 Spin"
              >
                <RefreshCw className={`w-3 h-3 ${isAutoRotate ? 'animate-spin' : ''}`} />
                360°
              </button>
            </div>

            {/* Finish Selector */}
            {productType === 'mug' && (
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-sm text-xs">
                <span className="text-[10px] font-bold text-stone-400 px-1 uppercase tracking-wider">Finish</span>
                <button
                  onClick={() => setMugFinish('glossy')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition ${
                    mugFinish === 'glossy' ? 'bg-[#6b0f1a] text-white shadow-sm' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  Glossy
                </button>
                <button
                  onClick={() => setMugFinish('matte')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition ${
                    mugFinish === 'matte' ? 'bg-[#6b0f1a] text-white shadow-sm' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  Matte
                </button>
                <button
                  onClick={() => setMugFinish('metallic_rim')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition ${
                    mugFinish === 'metallic_rim' ? 'bg-[#6b0f1a] text-white shadow-sm' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  Gold Rim
                </button>
              </div>
            )}
          </div>

          {/* R3F WebGL Canvas Container */}
          <div className="w-full h-80 sm:h-96 relative bg-gradient-to-b from-[#f8f6f6] to-stone-100">
            <Canvas
              camera={{ position: [0, 0, 3], fov: 45 }}
              gl={{ antialias: true, preserveDrawingBuffer: true }}
            >
              <StudioLighting />

              {productType === 'mug' ? (
                <MugModel
                  texture={canvasTexture}
                  innerColor={mugInnerColor}
                  handleColor={mugHandleColor}
                  finish={mugFinish}
                  showBleedGuide={showBleedLines}
                />
              ) : (
                <TShirtModel
                  texture={canvasTexture}
                  tshirtColor={tshirtColor}
                />
              )}

              <OrbitControls
                ref={orbitControlsRef}
                enablePan={false}
                minDistance={1.6}
                maxDistance={5.0}
                autoRotate={isAutoRotate}
                autoRotateSpeed={2.0}
              />
            </Canvas>
          </div>

          {/* Bottom Customizer Options Bar (Ceramic Interior Colors) */}
          <div className="p-3 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
            {productType === 'mug' ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                  Ceramic Interior Color:
                </span>
                <div className="flex items-center gap-1.5">
                  {MUG_INNER_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => {
                        setMugInnerColor(c.hex);
                        setMugHandleColor(c.hex);
                      }}
                      className={`w-6 h-6 rounded-full border-2 transition ${
                        mugInnerColor === c.hex ? 'border-[#6b0f1a] scale-110 shadow-md' : 'border-stone-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                  T-Shirt Fabric Color:
                </span>
                <div className="flex items-center gap-2">
                  {[
                    { name: 'Burgundy Red', hex: '#6b0f1a' },
                    { name: 'Pure White', hex: '#ffffff' },
                    { name: 'Midnight Black', hex: '#0f172a' },
                    { name: 'Heather Grey', hex: '#64748b' },
                    { name: 'Navy Blue', hex: '#1e3a8a' },
                    { name: 'Vintage Olive', hex: '#3f6212' },
                  ].map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setTshirtColor(c.hex)}
                      className={`w-6 h-6 rounded-full border-2 transition ${
                        tshirtColor === c.hex ? 'border-[#6b0f1a] scale-110 shadow-md' : 'border-stone-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="text-right text-xs text-stone-500 font-medium hidden sm:block">
              Click & drag to rotate 3D mug • Scroll to zoom
            </div>
          </div>
        </section>

        {/* SECTION 2: WIDE DESIGN CANVAS (DIRECTLY UNDERNEATH THE 3D MUG) */}
        <section className="bg-white border border-stone-200 rounded-3xl p-6 shadow-md flex flex-col items-center">
          <FabricEditor
            onCanvasReady={setFabricCanvas}
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
            showBleedLines={showBleedLines}
            setShowBleedLines={setShowBleedLines}
            showGrid={showGrid}
            setShowGrid={setShowGrid}
          />
        </section>

      </main>
    </div>
  );
}
