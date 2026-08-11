import { useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import * as fabric from 'fabric';

/**
 * Senior Production Hook:
 * Bridges a Fabric.js 2D Canvas to a Three.js CanvasTexture for R3F 3D rendering.
 * 
 * Performance & WebGL Integrity:
 * 1. Enforces sRGB ColorSpace for 1:1 color accuracy between 2D editor and 3D preview.
 * 2. Throttles GPU texture uploads via requestAnimationFrame to avoid WebGL frame thrashing.
 * 3. Enforces ClampToEdgeWrapping to prevent UV edge bleeding over seams.
 * 4. Manages strict GPU memory garbage collection on unmount (texture.dispose()).
 */
export function useCanvasTexture(fabricCanvas: fabric.Canvas | null) {
  const [, setRevision] = useState(0);

  // 1. Create and memoize the CanvasTexture instance once when the HTML canvas element is available
  const texture = useMemo(() => {
    if (!fabricCanvas) return null;

    try {
      const htmlCanvas = fabricCanvas.getElement();
      if (!htmlCanvas) return null;

      const tex = new THREE.CanvasTexture(htmlCanvas);

      // Enforce production color space and filtering
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.anisotropy = 16;
      tex.generateMipmaps = true;

      return tex;
    } catch (err) {
      console.warn('CanvasTexture initialization deferred:', err);
      return null;
    }
  }, [fabricCanvas]);

  // 2. Event listener for Fabric.js 'after:render' with RAF throttling
  useEffect(() => {
    if (!fabricCanvas || !texture) return;

    let updatePending = false;
    let rafId: number | null = null;

    const handleCanvasUpdate = () => {
      if (!updatePending) {
        updatePending = true;
        rafId = requestAnimationFrame(() => {
          texture.needsUpdate = true;
          setRevision((prev) => prev + 1);
          updatePending = false;
        });
      }
    };

    // Listen to all modification, render, and object manipulation events
    fabricCanvas.on('after:render', handleCanvasUpdate);

    // Initial GPU texture upload
    texture.needsUpdate = true;

    return () => {
      fabricCanvas.off('after:render', handleCanvasUpdate);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [fabricCanvas, texture]);

  // 3. Prevent GPU memory leaks on unmount or product switches
  useEffect(() => {
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [texture]);

  return texture;
}
