export default function EraserSettings({ canvas }) {
  return (
    <input
      type="range"
      min="5"
      max="80"
      onChange={(e) => {
        canvas.freeDrawingBrush.width = +e.target.value;
      }}
    />
  );
}
