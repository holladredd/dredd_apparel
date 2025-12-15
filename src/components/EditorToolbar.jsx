export default function EditorToolbar({ canvas, fabric }) {
  const addText = () => {
    if (!canvas || !fabric) return;

    const text = new fabric.Textbox("Edit text", {
      left: 120,
      top: 120,
      width: 220,
      fontSize: 22,
      fill: "#000",
      selectable: true,
      evented: true,
      hasControls: true,
      hasBorders: true,
      cornerColor: "#2563eb",
      borderColor: "#2563eb",
      cornerSize: 10,
      transparentCorners: false,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();

    setTimeout(() => {
      canvas.setActiveObject(text);
      text.enterEditing();
      text.hiddenTextarea?.focus();
    }, 0);
  };

  const changeFont = async (fontFamily) => {
    const obj = canvas.getActiveObject();
    if (obj && obj.type === "textbox") {
      try {
        await document.fonts.load(`1em "${fontFamily}"`);
        obj.set({ fontFamily });
        canvas.renderAll();
      } catch (error) {
        console.error(`Font ${fontFamily} could not be loaded`, error);
        // Fallback: still try to set the font
        obj.set({ fontFamily });
        canvas.renderAll();
      }
    }
  };

  const changeFontSize = (size) => {
    const obj = canvas.getActiveObject();
    if (obj && obj.type === "textbox") {
      obj.set({ fontSize: size });
      canvas.renderAll();
    }
  };

  const changeColor = (color) => {
    const obj = canvas.getActiveObject();
    if (obj && obj.type === "textbox") {
      obj.set({ fill: color });
      canvas.renderAll();
    }
  };

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
    <div className="p-2 bg-gray-100 border-b">
      {canvas ? (
        <div className="flex items-center space-x-2">
          <button
            onClick={addText}
            className="px-3 py-1 bg-white border rounded shadow-sm hover:bg-gray-50"
          >
            Add Text
          </button>
        </div>
      ) : (
        <div className="text-sm text-gray-500">Initializing Canvas...</div>
      )}

      <div className="flex items-center space-x-2 mt-2">
        <select
          onChange={(e) => changeFont(e.target.value)}
          className="border rounded px-1 py-1"
        >
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="8"
          max="100"
          defaultValue={20}
          onChange={(e) => changeFontSize(parseInt(e.target.value))}
          className="border rounded w-16 px-1 py-1"
        />

        <input
          type="color"
          onChange={(e) => changeColor(e.target.value)}
          className="w-8 h-8 p-0 border-0"
        />
      </div>
    </div>
  );
}
