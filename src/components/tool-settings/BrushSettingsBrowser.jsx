export default function BrushSettingsBrowser({
  color,
  setColor,
  width,
  setWidth,
  finishDrawing,
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Color</label>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-full h-8"
      />

      <label className="block text-sm font-medium">Width</label>
      <input
        type="range"
        min="1"
        max="50"
        value={width}
        onChange={(e) => setWidth(Number(e.target.value))}
        className="w-full"
      />
      <span className="text-xs text-gray-600">{width}px</span>
      <button
        onClick={finishDrawing}
        className="w-full mt-3 bg-green-600 text-white py-2 rounded text-sm"
      >
        Finish & Keep Strokes
      </button>
    </div>
  );
}
