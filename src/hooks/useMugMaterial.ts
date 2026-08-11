import { useMemo, useEffect } from 'react';
import * as THREE from 'three';

export interface MaterialOptions {
  finish?: 'glossy' | 'matte' | 'metallic_rim';
  baseColor?: string;
}

/**
 * Senior Production Hook:
 * Generates an isolated THREE.MeshPhysicalMaterial for the 3D printable ceramic zone.
 * Employs physical clearcoat glaze, specular reflections, and realistic IOR (1.52).
 */
export function useMugMaterial(
  texture: THREE.CanvasTexture | null,
  options: MaterialOptions = {}
) {
  const { finish = 'glossy', baseColor = '#ffffff' } = options;

  const material = useMemo(() => {
    const isMatte = finish === 'matte';
    const isGold = finish === 'metallic_rim';

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(baseColor),
      roughness: isMatte ? 0.65 : 0.08,
      metalness: isGold ? 0.25 : 0.02,
      clearcoat: isMatte ? 0.0 : 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 0.95,
      ior: 1.52, // Porcelain / ceramic index of refraction
      specularIntensity: 1.0,
      specularColor: new THREE.Color('#ffffff'),
    });

    if (texture) {
      mat.map = texture;
    }

    return mat;
  }, [texture, finish, baseColor]);

  // Clean up WebGL resources when material changes or unmounts
  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return material;
}

