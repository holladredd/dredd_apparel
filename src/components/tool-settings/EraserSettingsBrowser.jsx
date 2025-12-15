export default function EraserSettingsBrowser({ width, setWidth }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Eraser Width</label>
      <input
        type="range"
        min="5"
        max="80"
        value={width}
        onChange={(e) => setWidth(Number(e.target.value))}
        className="w-full"
      />
      <span className="text-xs text-gray-600">{width}px</span>
    </div>
  );
}
