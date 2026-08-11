import { useMemo, useEffect } from 'react';
import * as THREE from 'three';

interface TShirtModelProps {
  texture: THREE.CanvasTexture | null;
  tshirtColor?: string;
}

/**
 * Photorealistic 3D T-Shirt Garment Component:
 * - Organic 3D garment mesh with natural fabric volume, drape waves, and shoulder contours.
 * - Procedural cotton jersey knit weave bump map for realistic fabric micro-texture.
 * - Conforming front chest print area that preserves artwork, scale, and colors perfectly.
 * - Ribbed crewneck collar, sleeve cuffs, and folded hem seams.
 */
export default function TShirtModel({
  texture,
  tshirtColor = '#ffffff',
}: TShirtModelProps) {
  // 1. Procedural Cotton Jersey Weave Bump Map
  const cottonBumpMap = useMemo(() => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 512, 512);

      const imgData = ctx.getImageData(0, 0, 512, 512);
      const data = imgData.data;

      for (let y = 0; y < 512; y++) {
        for (let x = 0; x < 512; x++) {
          const idx = (y * 512 + x) * 4;
          // Cotton jersey interlocking stitch pattern
          const stitchX = Math.sin((x / 512) * Math.PI * 128);
          const stitchY = Math.cos((y / 512) * Math.PI * 128);
          const noise = (Math.random() - 0.5) * 14;
          const val = Math.min(255, Math.max(0, 128 + stitchX * stitchY * 28 + noise));

          data[idx] = val;
          data[idx + 1] = val;
          data[idx + 2] = val;
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      const bumpTex = new THREE.CanvasTexture(canvas);
      bumpTex.wrapS = THREE.RepeatWrapping;
      bumpTex.wrapT = THREE.RepeatWrapping;
      bumpTex.repeat.set(6, 6);
      return bumpTex;
    } catch {
      return null;
    }
  }, []);

  // Clean up bump texture on unmount
  useEffect(() => {
    return () => {
      cottonBumpMap?.dispose();
    };
  }, [cottonBumpMap]);

  // 2. Cotton Fabric Base Material (Soft matte fabric with sheen & bump map)
  const fabricMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(tshirtColor),
      roughness: 0.88,
      metalness: 0.0,
      clearcoat: 0.0,
      bumpMap: cottonBumpMap || undefined,
      bumpScale: 0.008,
      sheen: 0.15,
      sheenColor: new THREE.Color('#ffffff'),
      sheenRoughness: 0.8,
    });
  }, [tshirtColor, cottonBumpMap]);

  // 3. Front Chest Print Panel Material (DTG / Screen print ink texture conforming to cotton)
  const printMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ffffff'),
      roughness: 0.78,
      metalness: 0.0,
      transparent: true,
      alphaTest: 0.01,
      bumpMap: cottonBumpMap || undefined,
      bumpScale: 0.005,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    if (texture) {
      mat.map = texture;
    }

    return mat;
  }, [texture, cottonBumpMap]);

  useEffect(() => {
    return () => {
      fabricMaterial.dispose();
      printMaterial.dispose();
    };
  }, [fabricMaterial, printMaterial]);

  // 4. Organic Torso Geometry with 3D Fabric Volume & Natural Drape Wrinkles
  const torsoGeometry = useMemo(() => {
    // 3D Contoured Torso Box Geometry (High subdivision for smooth organic folds)
    const geom = new THREE.BoxGeometry(1.52, 1.92, 0.44, 48, 48, 16);
    const pos = geom.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Shoulder taper & waist contouring
      const heightFactor = (y + 0.96) / 1.92; // 0 at bottom, 1 at neck
      const shoulderExpand = 1 + Math.sin(heightFactor * Math.PI * 0.8) * 0.14;
      
      x *= shoulderExpand;

      // Chest curvature (subtle push forward at chest level)
      if (z > 0 && y > -0.2 && y < 0.6) {
        z += Math.sin((y + 0.2) / 0.8 * Math.PI) * 0.06;
      }

      // Natural Drape Wrinkles & Fabric Folds (Under armpits and waist ripples)
      const isFront = z > 0;
      const drape = Math.sin(x * 5.2 + y * 3.8) * 0.022 * Math.cos(y * 1.5);
      const hemRipples = Math.cos(x * 8.5) * 0.015 * Math.max(0, -y - 0.4);

      if (isFront) {
        z += drape + hemRipples;
      } else {
        z -= drape + hemRipples;
      }

      pos.setXYZ(i, x, y, z);
    }

    geom.computeVertexNormals();
    return geom;
  }, []);

  // 5. Left Sleeve Geometry (Angled with natural elbow drape & cuff hem)
  const leftSleeveGeometry = useMemo(() => {
    const geom = new THREE.CylinderGeometry(0.28, 0.31, 0.72, 32, 16);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      // Sleeve fabric fold variation
      z += Math.sin(y * 8.0) * 0.015;
      pos.setXYZ(i, x, y, z);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Right Sleeve Geometry
  const rightSleeveGeometry = useMemo(() => {
    const geom = new THREE.CylinderGeometry(0.28, 0.31, 0.72, 32, 16);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      z += Math.sin(y * 8.0) * 0.015;
      pos.setXYZ(i, x, y, z);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // 6. Curved Front Chest Print Panel Mesh (Matches 2100x950 canvas aspect ratio 2.21:1)
  const printPanelGeometry = useMemo(() => {
    // Width 1.28, Height 0.579 preserves exact 2.2105:1 horizontal canvas proportion
    const geom = new THREE.PlaneGeometry(1.28, 0.579, 32, 32);
    const pos = geom.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Match the front chest 3D curvature exactly
      const drape = Math.sin(x * 5.2 + (y + 0.05) * 3.8) * 0.018 * Math.cos((y + 0.05) * 1.5);
      const chestCurve = Math.sin((y + 0.3) / 0.6 * Math.PI) * 0.04;

      z += chestCurve + drape;
      pos.setXYZ(i, x, y, z);
    }

    geom.computeVertexNormals();
    return geom;
  }, []);

  return (
    <group position={[0, -0.15, 0]} scale={1.08}>
      {/* 1. Main Contoured Torso Body with Fabric Folds */}
      <mesh geometry={torsoGeometry} material={fabricMaterial} castShadow receiveShadow />

      {/* 2. Left Sleeve (Angled with shoulder seam) */}
      <mesh 
        geometry={leftSleeveGeometry} 
        material={fabricMaterial} 
        position={[-1.02, 0.62, 0]} 
        rotation={[0, 0, Math.PI / 5.2]} 
        castShadow 
        receiveShadow 
      />

      {/* Left Sleeve Hem Ring */}
      <mesh position={[-1.23, 0.31, 0]} rotation={[0, 0, Math.PI / 5.2]} material={fabricMaterial}>
        <torusGeometry args={[0.31, 0.025, 16, 32]} />
      </mesh>

      {/* 3. Right Sleeve (Angled with shoulder seam) */}
      <mesh 
        geometry={rightSleeveGeometry} 
        material={fabricMaterial} 
        position={[1.02, 0.62, 0]} 
        rotation={[0, 0, -Math.PI / 5.2]} 
        castShadow 
        receiveShadow 
      />

      {/* Right Sleeve Hem Ring */}
      <mesh position={[1.23, 0.31, 0]} rotation={[0, 0, -Math.PI / 5.2]} material={fabricMaterial}>
        <torusGeometry args={[0.31, 0.025, 16, 32]} />
      </mesh>

      {/* 4. 3D Ribbed Crewneck Collar Band */}
      <mesh position={[0, 0.96, 0.02]} rotation={[Math.PI / 2.3, 0, 0]} material={fabricMaterial}>
        <torusGeometry args={[0.32, 0.048, 16, 48]} />
      </mesh>

      {/* 5. Bottom Hem Seam Border */}
      <mesh position={[0, -0.96, 0]} rotation={[Math.PI / 2, 0, 0]} material={fabricMaterial}>
        <torusGeometry args={[0.76, 0.022, 16, 48]} />
      </mesh>

      {/* 6. Front Chest Print Area (Curved plane sitting seamlessly on front chest) */}
      <mesh geometry={printPanelGeometry} material={printMaterial} position={[0, 0.12, 0.224]} />
    </group>
  );
}
