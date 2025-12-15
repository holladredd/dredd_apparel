export default function TextSettingsBrowser({
  selectedId,
  objects,
  setObjects,
  setActiveTool,
  setSelectedId,
}) {
  const selected = objects.find((o) => o.id === selectedId);

  const update = (attrs) =>
    setObjects((o) =>
      o.map((x) => (x.id === selectedId ? { ...x, ...attrs } : x))
    );

  const fonts = [
    "Amatic SC",
    "Anton",
    "Arial",
    "Arimo",
    "Bebas Neue",
    "Caveat",
    "Comic Sans MS",
    "Cormorant",
    "Courier New",
    "Dancing Script",
    "EB Garamond",
    "Fauna One",
    "Fjalla One",
    "Georgia",
    "Impact",
    "Indie Flower",
    "Josefin Sans",
    "Lato",
    "Limelight",
    "Lobster",
    "Merriweather",
    "Monoton",
    "Montserrat",
    "Noto Sans",
    "Open Sans",
    "Oswald",
    "PT Sans",
    "Pacifico",
    "Palatino",
    "Philosopher",
    "Playfair Display",
    "Poppins",
    "Quicksand",
    "Raleway",
    "Roboto",
    "Slabo 27px",
    "Source Sans Pro",
    "Tahoma",
    "Teko",
    "Times New Roman",
    "Trebuchet MS",
    "Trirong",
    "Ubuntu",
    "UnifrakturMaguntia",
    "Varela Round",
    "Verdana",
    "Yanone Kaffeesatz",
  ].sort();

  return (
    <div className="space-y-3">
      <button
        onClick={() => {
          const newText = {
            id: `text-${Date.now()}`,
            type: "text",
            x: 100,
            y: 100,
            text: "Edit me",
            fontSize: 24,
            fill: "#000",
            fontFamily: "Arial",
            editable: true,
            visible: true,
            draggable: true,
          };
          setObjects((o) => [...o, newText]);
          setSelectedId(newText.id); // auto-select it
        }}
        className="w-full mt-3 bg-blue-600 text-white py-2 rounded"
      >
        Add New Text
      </button>

      {selected && selected.type === "text" && (
        <div className="flex items-center gap-2">
          <select
            value={selected.fontFamily || "Arial"}
            onChange={(e) => update({ fontFamily: e.target.value })}
            className="border rounded px-2 py-1"
          >
            {fonts.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="8"
            max="200"
            value={selected.fontSize || 24}
            onChange={(e) => update({ fontSize: Number(e.target.value) })}
            className="border rounded w-20 px-2 py-1"
          />

          <input
            type="color"
            value={selected.fill || "#000"}
            onChange={(e) => update({ fill: e.target.value })}
            className="w-8 h-8 p-0 border-0"
          />
        </div>
      )}
    </div>
  );
}
