export default function MoveSettingsBrowser({ selectedId, setObjects }) {
  const bringForward = () =>
    setObjects((o) => {
      const idx = o.findIndex((x) => x.id === selectedId);
      if (idx === -1 || idx === o.length - 1) return o;
      const next = [...o];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });

  const sendBackwards = () =>
    setObjects((o) => {
      const idx = o.findIndex((x) => x.id === selectedId);
      if (idx <= 0) return o;
      const next = [...o];
      [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
      return next;
    });

  const deleteSelected = () => {
    setObjects((o) => o.filter((x) => x.id !== selectedId));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Arrange</label>
      <div className="flex gap-2">
        <button
          onClick={bringForward}
          className="px-3 py-2 border rounded bg-white hover:bg-gray-100"
          title="Bring Forward"
        >
          ↑
        </button>
        <button
          onClick={sendBackwards}
          className="px-3 py-2 border rounded bg-white hover:bg-gray-100"
          title="Send Backward"
        >
          ↓
        </button>
        <button
          onClick={deleteSelected}
          className="px-3 py-2 border rounded bg-white hover:bg-red-100 text-red-600"
          title="Delete"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
