import { useEffect, useRef, memo } from "react";

function CanvasEditor({ onReady }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let canvasInstance;
    let fabric;

    async function initFabric() {
      const fabricModule = await import("fabric");
      fabric = fabricModule.fabric || fabricModule;

      canvasInstance = new fabric.Canvas(canvasRef.current, {
        width: 400,
        height: 500,
        backgroundColor: "#f0f0f0",
      });

      // Zoom functionality
      canvasInstance.on("mouse:wheel", function (opt) {
        const delta = opt.e.deltaY;
        let zoom = canvasInstance.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        canvasInstance.zoomToPoint(
          { x: opt.e.offsetX, y: opt.e.offsetY },
          zoom
        );
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });

      // Pan functionality
      canvasInstance.on("mouse:down", function (opt) {
        const evt = opt.e;
        if (evt.altKey === true) {
          this.isDragging = true;
          this.selection = false;
          this.lastPosX = evt.clientX;
          this.lastPosY = evt.clientY;
        }
      });

      canvasInstance.on("mouse:move", function (opt) {
        if (this.isDragging) {
          const e = opt.e;
          const vpt = this.viewportTransform;
          vpt[4] += e.clientX - this.lastPosX;
          vpt[5] += e.clientY - this.lastPosY;
          this.requestRenderAll();
          this.lastPosX = e.clientX;
          this.lastPosY = e.clientY;
        }
      });

      canvasInstance.on("mouse:up", function (opt) {
        this.setViewportTransform(this.viewportTransform);
        this.isDragging = false;
        this.selection = true;
      });

      if (onReady) {
        onReady(canvasInstance, fabric);
      }
    }

    initFabric();

    return () => {
      canvasInstance?.dispose();
    };
  }, [onReady]);

  return (
    <div className="border rounded-lg p-4 bg-white shadow-inner">
      <canvas ref={canvasRef} />
      <p className="text-xs text-gray-500 mt-2 text-center">
        Hint: Use mouse wheel to zoom, hold 'Alt' and drag to pan.
      </p>
    </div>
  );
}

export default memo(CanvasEditor);
