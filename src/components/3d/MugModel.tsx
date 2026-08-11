import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useMugMaterial } from '../../hooks/useMugMaterial';

interface MugModelProps {
  texture: THREE.CanvasTexture | null;
  innerColor?: string;
  handleColor?: string;
  finish?: 'glossy' | 'matte' | 'metallic_rim';
  showBleedGuide?: boolean;
}

/**
 * Photorealistic 3D Ceramic Mug Model:
 * - Precise Lathe Geometry creating seamless inner cavity, outer wall, rounded lip, and recessed foot ring.
 * - 21cm x 9.5cm flat UV wrap outer printable zone.
 * - Ergonomic ceramic handle with tapered attachment pads.
 * - Physical clearcoat ceramic glaze materials with high IOR (1.52) and specular highlights.
 */
export default function MugModel({
  texture,
  innerColor = '#ffffff',
  handleColor = '#ffffff',
  finish = 'glossy',
}: MugModelProps) {
  // 1. Physical Ceramic Material for the Printable Outer Surface Wrap
  const printMaterial = useMugMaterial(texture, { finish });

  const isMatte = finish === 'matte';
  const isGoldRim = finish === 'metallic_rim';

  // 2. Physical Ceramic Material for Interior Cavity & Body
  const innerMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(innerColor),
      roughness: isMatte ? 0.65 : 0.08,
      metalness: 0.02,
      clearcoat: isMatte ? 0.0 : 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
      ior: 1.52,
      specularIntensity: 1.0,
    });
  }, [innerColor, isMatte]);

  // 3. Physical Ceramic Material for Handle
  const handleMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(handleColor),
      roughness: isMatte ? 0.65 : 0.08,
      metalness: isGoldRim ? 0.2 : 0.02,
      clearcoat: isMatte ? 0.0 : 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
      ior: 1.52,
      specularIntensity: 1.0,
    });
  }, [handleColor, isMatte, isGoldRim]);

  // 4. Physical Material for Top Rim & Bottom Base
  const rimMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: isGoldRim ? new THREE.Color('#d4af37') : new THREE.Color(innerColor),
      roughness: isGoldRim ? 0.15 : (isMatte ? 0.65 : 0.08),
      metalness: isGoldRim ? 0.85 : 0.02,
      clearcoat: isMatte ? 0.0 : 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 0.98,
      ior: 1.52,
      specularIntensity: 1.0,
    });
  }, [innerColor, isMatte, isGoldRim]);

  // Clean up materials on unmount
  useEffect(() => {
    return () => {
      innerMaterial.dispose();
      handleMaterial.dispose();
      rimMaterial.dispose();
    };
  }, [innerMaterial, handleMaterial, rimMaterial]);

  // 5. Seamless 3D Ceramic Lathe Profile (Body, Rim, Inner Wall, Bottom Floor, Recessed Foot)
  const latheGeometry = useMemo(() => {
    const path = new THREE.Path();
    
    // Bottom Recessed Base Center
    path.moveTo(0.0, -0.95);
    path.lineTo(0.68, -0.95);
    // Recessed Foot Ring
    path.lineTo(0.72, -0.98);
    path.lineTo(0.81, -0.93);
    // Outer Wall Curve
    path.lineTo(0.85, -0.88);
    path.lineTo(0.85, 0.88);
    // Top Rounded Ceramic Lip
    path.quadraticCurveTo(0.85, 0.95, 0.81, 0.95);
    path.quadraticCurveTo(0.77, 0.95, 0.77, 0.88);
    // Inner Wall Down
    path.lineTo(0.77, -0.84);
    // Inner Floor Curved Corner
    path.quadraticCurveTo(0.77, -0.89, 0.70, -0.89);
    path.lineTo(0.0, -0.89);

    const points = path.getPoints(32);
    const geom = new THREE.LatheGeometry(points, 128);
    geom.computeVertexNormals();
    return geom;
  }, []);

  // 6. Smooth Ergonomic Ceramic Handle Geometry (Swept path with tapered joints)
  const handleGeometry = useMemo(() => {
    // Define handle spline curve
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.62, -0.84),
      new THREE.Vector3(0, 0.68, -1.22),
      new THREE.Vector3(0, 0.20, -1.45),
      new THREE.Vector3(0, -0.20, -1.45),
      new THREE.Vector3(0, -0.68, -1.22),
      new THREE.Vector3(0, -0.62, -0.84),
    ]);

    const geom = new THREE.TubeGeometry(curve, 64, 0.09, 24, false);
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Top/Bottom Handle Attachment Pads (fuses handle into mug ceramic wall naturally)
  const handlePadGeometry = useMemo(() => {
    const geom = new THREE.CylinderGeometry(0.12, 0.15, 0.12, 32);
    geom.rotateX(Math.PI / 2);
    return geom;
  }, []);

  return (
    <group dispose={null} position={[0, -0.05, 0]}>
      {/* 1. Main Ceramic Lathe Body (Inner Wall, Rim, Recessed Foot Ring) */}
      <mesh geometry={latheGeometry} material={innerMaterial} castShadow receiveShadow />

      {/* 2. Top Ceramic Lip Accent / Gold Metallic Rim */}
      {isGoldRim && (
        <mesh position={[0, 0.92, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.81, 0.041, 24, 128]} />
          <primitive object={rimMaterial} attach="material" />
        </mesh>
      )}

      {/* 3. Outer Printable Wrap Zone (21cm x 9.5cm UV mapped cylinder, radius=0.852) */}
      <mesh material={printMaterial} castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.852, 0.852, 1.76, 128, 1, true]} />
      </mesh>

      {/* 4. Ergonomic Ceramic Handle */}
      <group>
        <mesh geometry={handleGeometry} material={handleMaterial} castShadow receiveShadow />
        
        {/* Upper Handle Joint Pad */}
        <mesh 
          geometry={handlePadGeometry} 
          material={handleMaterial} 
          position={[0, 0.62, -0.82]} 
          rotation={[-0.2, 0, 0]} 
        />
        
        {/* Lower Handle Joint Pad */}
        <mesh 
          geometry={handlePadGeometry} 
          material={handleMaterial} 
          position={[0, -0.62, -0.82]} 
          rotation={[0.2, 0, 0]} 
        />
      </group>
    </group>
  );
}
