import { ContactShadows, Environment } from '@react-three/drei';

/**
 * Commercial 3D Studio Product Photography Lighting:
 * - Environment map HDRI reflections for glossy ceramic clearcoat & realistic highlights.
 * - Multi-point key light, fill light, rim highlights, and grounded contact shadows.
 */
export default function StudioLighting() {
  return (
    <>
      {/* 1. HDRI Studio Environment Map for Realistic Glaze Reflections */}
      <Environment preset="studio" environmentIntensity={0.65} />

      {/* 2. Soft Ambient Light for Overall Balanced Shadow Fill */}
      <ambientLight intensity={0.9} />

      {/* 3. Key Studio Light (Front Upper Right Spotlight with Shadow Map) */}
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* 4. Soft Fill Light (Left Side Shadow Softener) */}
      <directionalLight
        position={[-5, 4, 3]}
        intensity={0.8}
        color="#f8fafc"
      />

      {/* 5. Rim / Backlight for Ceramic Glaze Edge Highlights & Garment Separation */}
      <directionalLight
        position={[-4, 6, -5]}
        intensity={1.1}
        color="#e2e8f0"
      />

      {/* 6. Subtle Bottom Bounce Light for Under-Lip / Hem Ambient Occlusion */}
      <directionalLight
        position={[0, -4, 2]}
        intensity={0.3}
        color="#ffffff"
      />

      {/* 7. Soft Grounded Product Contact Shadow */}
      <ContactShadows
        position={[0, -1.06, 0]}
        opacity={0.45}
        scale={7}
        blur={2.2}
        far={2.8}
        color="#0f172a"
      />
    </>
  );
}
