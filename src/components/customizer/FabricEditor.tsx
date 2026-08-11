import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { 
  Type, Image as ImageIcon, Square, Circle, Layers, Trash2, 
  ArrowUp, ArrowDown, Copy, AlignCenter, 
  Palette, Grid, Sparkles, Check, Shield, Plus, Upload, Sliders
} from 'lucide-react';
import { PRESET_CLIPARTS } from '../../data/mockData';

export const PRINT_WIDTH = 2100;
export const PRINT_HEIGHT = 950;
export const ASPECT_RATIO = PRINT_WIDTH / PRINT_HEIGHT; // 2.2105

interface FabricEditorProps {
  onCanvasReady: (canvas: fabric.Canvas) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  showBleedLines: boolean;
  setShowBleedLines: (show: boolean) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
}

const FONTS = [
  { label: 'Impact / Headline', value: 'Impact' },
  { label: 'Playfair (Serif)', value: 'Georgia, serif' },
  { label: 'Inter (Sans)', value: 'system-ui, sans-serif' },
  { label: 'Courier (Mono)', value: 'Courier New, monospace' },
  { label: 'Cursive / Vintage', value: 'Brush Script MT, cursive' },
];

export default function FabricEditor({
  onCanvasReady,
  backgroundColor,
  setBackgroundColor,
  showBleedLines,
  setShowBleedLines,
  showGrid,
  setShowGrid,
}: FabricEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'clipart' | 'shapes' | 'background' | 'layers' | null>('text');
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const [layers, setLayers] = useState<fabric.Object[]>([]);
  const [textColor, setTextColor] = useState('#6b0f1a');
  const [fontSize, setFontSize] = useState(120);
  const [fontFamily, setFontFamily] = useState('Impact');

  const [displaySize, setDisplaySize] = useState({ width: 840, height: 380 });

  // Calculate responsive dimensions & init Fabric canvas
  useEffect(() => {
    if (!canvasElRef.current || !containerRef.current) return;

    // Initial container width calculation
    const containerW = containerRef.current.clientWidth || 880;
    const calcWidth = Math.max(Math.min(containerW - 32, 920), 400);
    const calcHeight = Math.round(calcWidth / ASPECT_RATIO);
    const scaleFactor = calcWidth / PRINT_WIDTH;

    setDisplaySize({ width: calcWidth, height: calcHeight });

    const fbCanvas = new fabric.Canvas(canvasElRef.current, {
      width: calcWidth,
      height: calcHeight,
      backgroundColor: backgroundColor,
      enableRetinaScaling: false,
      preserveObjectStacking: true,
      selectionColor: 'rgba(107, 15, 26, 0.15)',
      selectionBorderColor: '#6b0f1a',
      selectionLineWidth: 2,
    });

    fbCanvas.setZoom(scaleFactor);
    fabricCanvasRef.current = fbCanvas;

    // Default starter text elements on the canvas
    const titleText = new fabric.IText('ANTIQE', {
      left: PRINT_WIDTH / 2,
      top: PRINT_HEIGHT / 2 - 90,
      fontSize: 180,
      fontFamily: 'Impact',
      originX: 'center',
      originY: 'center',
      fill: '#6b0f1a',
    });

    const subText = new fabric.IText('CUSTOM PRINT STUDIO', {
      left: PRINT_WIDTH / 2,
      top: PRINT_HEIGHT / 2 + 90,
      fontSize: 65,
      fontFamily: 'system-ui, sans-serif',
      fontWeight: 'bold',
      originX: 'center',
      originY: 'center',
      fill: '#1c1917',
      charSpacing: 180,
    });

    fbCanvas.add(titleText, subText);
    fbCanvas.setActiveObject(titleText);

    // Sync active selection & layer list
    const updateLayers = () => {
      if (!fbCanvas) return;
      const objs = fbCanvas.getObjects().slice().reverse();
      setLayers(objs);
      const active = fbCanvas.getActiveObject() || null;
      setActiveObject(active);

      if (active && active.type === 'i-text') {
        const textObj = active as fabric.IText;
        if (textObj.fill) setTextColor(textObj.fill as string);
        if (textObj.fontSize) setFontSize(textObj.fontSize);
        if (textObj.fontFamily) setFontFamily(textObj.fontFamily);
      }
    };

    fbCanvas.on('object:added', updateLayers);
    fbCanvas.on('object:removed', updateLayers);
    fbCanvas.on('object:modified', updateLayers);
    fbCanvas.on('selection:created', updateLayers);
    fbCanvas.on('selection:updated', updateLayers);
    fbCanvas.on('selection:cleared', () => setActiveObject(null));

    onCanvasReady(fbCanvas);

    // Responsive Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !fabricCanvasRef.current) return;
      const w = Math.max(Math.min(containerRef.current.clientWidth - 32, 920), 400);
      const h = Math.round(w / ASPECT_RATIO);
      const s = w / PRINT_WIDTH;

      setDisplaySize({ width: w, height: h });
      fabricCanvasRef.current.setDimensions({ width: w, height: h });
      fabricCanvasRef.current.setZoom(s);
      fabricCanvasRef.current.requestRenderAll();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      fbCanvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  // Update Background Color
  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.backgroundColor = backgroundColor;
      fabricCanvasRef.current.requestRenderAll();
    }
  }, [backgroundColor]);

  // Canvas Actions
  const addText = (textString: string = 'YOUR DESIGN HERE', size: number = 110, font: string = 'Impact') => {
    if (!fabricCanvasRef.current) return;
    const text = new fabric.IText(textString, {
      left: PRINT_WIDTH / 2,
      top: PRINT_HEIGHT / 2,
      fontSize: size,
      fontFamily: font,
      fill: textColor,
      originX: 'center',
      originY: 'center',
    });
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.requestRenderAll();
  };

  const addClipart = (emoji: string) => {
    if (!fabricCanvasRef.current) return;
    const text = new fabric.IText(emoji, {
      left: PRINT_WIDTH / 2,
      top: PRINT_HEIGHT / 2,
      fontSize: 220,
      originX: 'center',
      originY: 'center',
    });
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.requestRenderAll();
  };

  const addShape = (type: 'rect' | 'circle' | 'border') => {
    if (!fabricCanvasRef.current) return;
    if (type === 'rect') {
      const rect = new fabric.Rect({
        left: PRINT_WIDTH / 2,
        top: PRINT_HEIGHT / 2,
        width: 450,
        height: 280,
        fill: '#6b0f1a',
        originX: 'center',
        originY: 'center',
        rx: 20,
        ry: 20,
      });
      fabricCanvasRef.current.add(rect);
      fabricCanvasRef.current.setActiveObject(rect);
    } else if (type === 'circle') {
      const circle = new fabric.Circle({
        left: PRINT_WIDTH / 2,
        top: PRINT_HEIGHT / 2,
        radius: 160,
        fill: '#6b0f1a',
        originX: 'center',
        originY: 'center',
      });
      fabricCanvasRef.current.add(circle);
      fabricCanvasRef.current.setActiveObject(circle);
    } else if (type === 'border') {
      const frame = new fabric.Rect({
        left: PRINT_WIDTH / 2,
        top: PRINT_HEIGHT / 2,
        width: PRINT_WIDTH - 140,
        height: PRINT_HEIGHT - 140,
        fill: 'transparent',
        stroke: '#6b0f1a',
        strokeWidth: 16,
        originX: 'center',
        originY: 'center',
        rx: 28,
        ry: 28,
      });
      fabricCanvasRef.current.add(frame);
      fabricCanvasRef.current.setActiveObject(frame);
    }
    fabricCanvasRef.current.requestRenderAll();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvasRef.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgObj = new Image();
      imgObj.src = event.target?.result as string;
      imgObj.onload = () => {
        if (!fabricCanvasRef.current) return;
        const fabImg = new fabric.Image(imgObj, {
          left: PRINT_WIDTH / 2,
          top: PRINT_HEIGHT / 2,
          originX: 'center',
          originY: 'center',
        });

        if (fabImg.width && fabImg.width > PRINT_WIDTH * 0.5) {
          fabImg.scaleToWidth(PRINT_WIDTH * 0.4);
        }

        fabricCanvasRef.current.add(fabImg);
        fabricCanvasRef.current.setActiveObject(fabImg);
        fabricCanvasRef.current.requestRenderAll();
      };
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const updateActiveObject = (props: Record<string, any>) => {
    if (!fabricCanvasRef.current) return;
    const obj = fabricCanvasRef.current.getActiveObject();
    if (!obj) return;

    obj.set(props);
    fabricCanvasRef.current.requestRenderAll();
    setActiveObject(obj);
  };

  const centerActiveObject = () => {
    if (!fabricCanvasRef.current) return;
    const obj = fabricCanvasRef.current.getActiveObject();
    if (!obj) return;

    fabricCanvasRef.current.centerObject(obj);
    fabricCanvasRef.current.requestRenderAll();
  };

  const moveLayer = (direction: 'up' | 'down') => {
    if (!fabricCanvasRef.current) return;
    const obj = fabricCanvasRef.current.getActiveObject();
    if (!obj) return;

    if (direction === 'up') fabricCanvasRef.current.bringObjectForward(obj);
    if (direction === 'down') fabricCanvasRef.current.sendObjectBackwards(obj);

    fabricCanvasRef.current.requestRenderAll();
    const objs = fabricCanvasRef.current.getObjects().slice().reverse();
    setLayers(objs as any);
  };

  const deleteActiveObject = () => {
    if (!fabricCanvasRef.current) return;
    const obj = fabricCanvasRef.current.getActiveObject();
    if (!obj) return;

    fabricCanvasRef.current.remove(obj);
    fabricCanvasRef.current.discardActiveObject();
    fabricCanvasRef.current.requestRenderAll();
    setActiveObject(null);
  };

  const duplicateActiveObject = async () => {
    if (!fabricCanvasRef.current) return;
    const obj = fabricCanvasRef.current.getActiveObject();
    if (!obj) return;

    const cloned = await obj.clone();
    cloned.set({
      left: (obj.left || 0) + 40,
      top: (obj.top || 0) + 40,
    });
    fabricCanvasRef.current.add(cloned);
    fabricCanvasRef.current.setActiveObject(cloned);
    fabricCanvasRef.current.requestRenderAll();
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center select-none space-y-4">
      
      {/* Primary Red & White Customizer Tools Header Bar */}
      <div className="w-full max-w-4xl bg-white border border-stone-200 rounded-2xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-2">
        
        {/* Tool Navigation Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab(activeTab === 'text' ? null : 'text')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'text'
                ? 'bg-[#6b0f1a] text-white shadow-md'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Type className="w-4 h-4" />
            Add Text
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'image' ? null : 'image')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'image'
                ? 'bg-[#6b0f1a] text-white shadow-md'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload Image
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'clipart' ? null : 'clipart')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'clipart'
                ? 'bg-[#6b0f1a] text-white shadow-md'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Graphics
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'shapes' ? null : 'shapes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'shapes'
                ? 'bg-[#6b0f1a] text-white shadow-md'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Square className="w-4 h-4" />
            Shapes
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'background' ? null : 'background')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'background'
                ? 'bg-[#6b0f1a] text-white shadow-md'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            Wrap Color
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'layers' ? null : 'layers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'layers'
                ? 'bg-[#6b0f1a] text-white shadow-md'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Layers ({layers.length})
          </button>
        </div>

        {/* View Guides Toggles */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-stone-200">
          <button
            onClick={() => setShowBleedLines(!showBleedLines)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
              showBleedLines ? 'bg-[#6b0f1a]/10 text-[#6b0f1a] border border-[#6b0f1a]/30 font-bold' : 'text-stone-500 hover:bg-stone-100'
            }`}
            title="Toggle Print Bleed Area Guides"
          >
            <Shield className="w-3.5 h-3.5" />
            Bleed
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
              showGrid ? 'bg-[#6b0f1a]/10 text-[#6b0f1a] border border-[#6b0f1a]/30 font-bold' : 'text-stone-500 hover:bg-stone-100'
            }`}
            title="Toggle Alignment Grid"
          >
            <Grid className="w-3.5 h-3.5" />
            Grid
          </button>
        </div>
      </div>

      {/* Expandable Contextual Drawer Panel */}
      {activeTab && (
        <div className="w-full max-w-4xl bg-white border border-stone-200 rounded-2xl p-4 shadow-sm animate-fade-in text-stone-900">
          
          {/* TAB 1: TEXT TOOLS */}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#6b0f1a] uppercase tracking-wider flex items-center gap-1.5">
                  <Type className="w-4 h-4" /> Typography & Text Studio
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => addText('YOUR BOLD TITLE', 140, 'Impact')}
                  className="py-2.5 px-4 bg-[#6b0f1a] hover:bg-[#520912] text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Bold Headline
                </button>
                <button
                  onClick={() => addText('ESTABLISHED 2026', 70, 'Georgia, serif')}
                  className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl border border-stone-200 transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#6b0f1a]" /> Add Vintage Subtitle
                </button>
                <button
                  onClick={() => addText('Custom quote or personal message', 50, 'system-ui, sans-serif')}
                  className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-xl border border-stone-200 transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#6b0f1a]" /> Add Body Text
                </button>
              </div>

              {/* Text Formatting Controls */}
              {activeObject && activeObject.type === 'i-text' && (
                <div className="pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-50 p-3 rounded-xl">
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">Font Style</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => {
                        setFontFamily(e.target.value);
                        updateActiveObject({ fontFamily: e.target.value });
                      }}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs text-stone-900 font-medium"
                    >
                      {FONTS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => {
                          setTextColor(e.target.value);
                          updateActiveObject({ fill: e.target.value });
                        }}
                        className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={textColor}
                        onChange={(e) => {
                          setTextColor(e.target.value);
                          updateActiveObject({ fill: e.target.value });
                        }}
                        className="flex-1 bg-white border border-stone-300 rounded-lg p-1.5 text-xs text-stone-800 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-stone-600 mb-1">
                      <span>Text Size</span>
                      <span>{fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="280"
                      value={fontSize}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFontSize(val);
                        updateActiveObject({ fontSize: val });
                      }}
                      className="w-full accent-[#6b0f1a] mt-2"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UPLOAD IMAGE */}
          {activeTab === 'image' && (
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-[#6b0f1a] uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" /> Custom Image & Logo Upload
              </span>

              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#6b0f1a]/40 hover:border-[#6b0f1a] bg-stone-50 hover:bg-rose-50/50 rounded-xl cursor-pointer transition text-center group">
                <Upload className="w-7 h-7 text-[#6b0f1a] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-stone-900">Click to upload transparent PNG or photo</span>
                <span className="text-[10px] text-stone-500 mt-0.5">High-res artwork recommended (PNG, JPG, SVG)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* TAB 3: GRAPHICS & CLIPART */}
          {activeTab === 'clipart' && (
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-[#6b0f1a] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Vector Stamp & Graphics Library
              </span>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {PRESET_CLIPARTS.map((art, idx) => (
                  <button
                    key={idx}
                    onClick={() => addClipart(art.svg)}
                    className="p-3 bg-stone-50 hover:bg-rose-50 border border-stone-200 hover:border-[#6b0f1a] rounded-xl flex flex-col items-center justify-center transition group"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-125 transition-transform">{art.svg}</span>
                    <span className="text-[9px] text-stone-600 group-hover:text-[#6b0f1a] font-bold truncate max-w-full">{art.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SHAPES */}
          {activeTab === 'shapes' && (
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-[#6b0f1a] uppercase tracking-wider flex items-center gap-1.5">
                <Square className="w-4 h-4" /> Print Frames & Decorative Badges
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => addShape('border')}
                  className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold rounded-xl border border-stone-200 flex items-center justify-center gap-2"
                >
                  <Square className="w-4 h-4 text-[#6b0f1a]" /> Add Full Wrap Outer Frame
                </button>
                <button
                  onClick={() => addShape('rect')}
                  className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold rounded-xl border border-stone-200 flex items-center justify-center gap-2"
                >
                  <Square className="w-4 h-4 text-rose-800" /> Add Rounded Badge Box
                </button>
                <button
                  onClick={() => addShape('circle')}
                  className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold rounded-xl border border-stone-200 flex items-center justify-center gap-2"
                >
                  <Circle className="w-4 h-4 text-rose-700" /> Add Circle Stamp Base
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: WRAP COLOR */}
          {activeTab === 'background' && (
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-[#6b0f1a] uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-4 h-4" /> Mug Exterior Wrap Base Color
              </span>

              <div className="flex flex-wrap items-center gap-3">
                {[
                  { name: 'Pure White', hex: '#ffffff' },
                  { name: 'Dark Red Burgundy', hex: '#6b0f1a' },
                  { name: 'Midnight Navy', hex: '#0f172a' },
                  { name: 'Warm Cream', hex: '#fef3c7' },
                  { name: 'Classic Blue', hex: '#1e3a8a' },
                  { name: 'Forest Green', hex: '#14532d' },
                  { name: 'Vintage Olive', hex: '#3f6212' },
                  { name: 'Mustard Gold', hex: '#a16207' },
                ].map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setBackgroundColor(c.hex)}
                    className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold flex items-center gap-2 transition ${
                      backgroundColor === c.hex ? 'border-[#6b0f1a] shadow-md scale-105' : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full border border-stone-300 shrink-0" style={{ backgroundColor: c.hex }} />
                    <span className="text-stone-800">{c.name}</span>
                    {backgroundColor === c.hex && <Check className="w-3.5 h-3.5 text-[#6b0f1a]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: LAYERS */}
          {activeTab === 'layers' && (
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-[#6b0f1a] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Element Layers & Ordering ({layers.length})
              </span>

              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {layers.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No elements on canvas</p>
                ) : (
                  layers.map((obj, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        fabricCanvasRef.current?.setActiveObject(obj);
                        fabricCanvasRef.current?.requestRenderAll();
                        setActiveObject(obj);
                      }}
                      className={`p-2 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition ${
                        activeObject === obj
                          ? 'bg-rose-50 border-[#6b0f1a] text-[#6b0f1a] font-bold shadow-sm'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span>
                        {obj.type === 'i-text' ? `Text: "${(obj as any).text.substring(0, 15)}"` : obj.type}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            fabricCanvasRef.current?.setActiveObject(obj);
                            moveLayer('up');
                          }}
                          className="p-1 hover:text-[#6b0f1a]"
                          title="Bring Forward"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            fabricCanvasRef.current?.setActiveObject(obj);
                            moveLayer('down');
                          }}
                          className="p-1 hover:text-[#6b0f1a]"
                          title="Send Backward"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Element Quick Floating Inspector Controls */}
      {activeObject && (
        <div className="w-full max-w-4xl bg-[#6b0f1a] text-white p-2.5 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in">
          <div className="flex items-center gap-2 font-bold px-2">
            <Sliders className="w-4 h-4 text-rose-200" />
            <span>Selected Element:</span>
            <span className="px-2 py-0.5 bg-white/20 rounded text-[11px] font-mono">
              {activeObject.type === 'i-text' ? 'Text' : activeObject.type}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={centerActiveObject}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold flex items-center gap-1 transition border border-white/20"
              title="Center on Canvas"
            >
              <AlignCenter className="w-3.5 h-3.5 text-rose-200" /> Center
            </button>

            <button
              onClick={duplicateActiveObject}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold flex items-center gap-1 transition border border-white/20"
              title="Duplicate Element"
            >
              <Copy className="w-3.5 h-3.5 text-rose-200" /> Clone
            </button>

            <button
              onClick={() => moveLayer('up')}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold flex items-center gap-1 transition border border-white/20"
              title="Bring Forward"
            >
              <ArrowUp className="w-3.5 h-3.5 text-rose-200" /> Forward
            </button>

            <button
              onClick={deleteActiveObject}
              className="px-3 py-1 bg-white text-[#6b0f1a] hover:bg-rose-50 rounded-lg font-extrabold flex items-center gap-1 transition shadow-md"
              title="Delete Element"
            >
              <Trash2 className="w-3.5 h-3.5 text-[#6b0f1a]" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* WIDE DESIGN CANVAS CONTAINER - Directly Underneath 3D Mug */}
      <div className="w-full max-w-4xl flex flex-col items-center">
        
        {/* Canvas Header Tag */}
        <div className="w-full flex items-center justify-between px-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6b0f1a] animate-pulse" />
            <span className="text-xs font-extrabold text-stone-800 tracking-wider uppercase font-mono">
              Live Design Canvas (21.0 cm × 9.5 cm Printable Area)
            </span>
          </div>

          <span className="text-[11px] font-mono text-stone-500 font-semibold hidden sm:inline">
            Drag, resize, rotate, and add elements freely • Aspect Ratio 2.21:1
          </span>
        </div>

        {/* The Wide Clean White Design Canvas Frame */}
        <div
          className="relative bg-white border-2 border-stone-300 rounded-2xl shadow-xl overflow-hidden group transition-all"
          style={{
            width: `${displaySize.width}px`,
            height: `${displaySize.height}px`,
          }}
        >
          {/* Printable Bleed Margin Overlay (Subtle) */}
          {showBleedLines && (
            <div className="absolute inset-0 pointer-events-none z-20">
              <div className="absolute inset-[4%] border border-dashed border-[#6b0f1a]/50 rounded-lg" />
              <span className="absolute top-2 left-2 text-[9px] font-mono bg-[#6b0f1a] text-white px-2 py-0.5 rounded shadow-sm opacity-90">
                BLEED MARGIN (0.5 CM)
              </span>

              {/* Center Seam Behind Handle */}
              <div className="absolute top-0 bottom-0 left-1/2 border-l-2 border-dashed border-[#6b0f1a]/60 transform -translate-x-1/2" />
              <span className="absolute top-2 left-1/2 transform -translate-x-1/2 text-[9px] font-mono bg-[#6b0f1a] text-white px-2 py-0.5 rounded shadow-sm opacity-90">
                HANDLE SEAM CENTER
              </span>
            </div>
          )}

          {/* Alignment Grid Overlay */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:32px_32px]" />
          )}

          {/* HTML5 Canvas Element */}
          <canvas ref={canvasElRef} />
        </div>

        {/* Bottom Helper Hint */}
        <p className="text-[11px] text-stone-500 mt-2 font-medium text-center">
          💡 Any changes on this canvas update the 3D mug above in real time.
        </p>
      </div>
    </div>
  );
}
