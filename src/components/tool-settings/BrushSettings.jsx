export default function BrushSettings({ canvas }) {
  return (
    <div className="space-y-2">
      <input
        type="range"
        min="1"
        max="50"
        onChange={(e) => {
          canvas.freeDrawingBrush.width = +e.target.value;
        }}
      />

      <input
        type="color"
        onChange={(e) => {
          canvas.freeDrawingBrush.color = e.target.value;
        }}
      />
    </div>
  );
}
