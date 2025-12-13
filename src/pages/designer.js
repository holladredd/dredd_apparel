import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

// load Fabric on client only
const CanvasEditor = dynamic(() => import("../components/CanvasEditor"), {
  ssr: false,
});

export default function Designer() {
  const router = useRouter();
  const { template } = router.query;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CanvasEditor template={template} />
        </div>
        <div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Preview (3D)</h3>
            <p className="text-sm mb-4">
              A simple 3D preview area using @react-three/fiber. Drop GLTF
              models into <code>/public/models</code>.
            </p>
            <div style={{ height: 300 }} className="border rounded">
              {/* 3D preview loaded client-side inside CanvasEditor (or separate component) */}
              <p className="p-4">3D preview will appear here.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow mt-4">
            <h4 className="font-semibold">Save & Export</h4>
            <p className="text-sm">
              Use controls on the canvas area to save to server or download
              PNG/SVG.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
