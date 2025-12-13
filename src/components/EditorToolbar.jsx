"use client";
export default function EditorToolbar({ canvas }) {
  const [text, setText] = useState("Hello");

  const addText = () => {
    if (!canvas) return;
    const t = new fabric.Textbox(text, {
      left: 150,
      top: 150,
      fontSize: 32,
      editable: true,
    });
    t.set({ id: `text-${Date.now()}` });
    canvas.add(t).setActiveObject(t);
    canvas.requestRenderAll();
  };

  const addImage = (e) => {
    if (!canvas) return;
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      fabric.Image.fromURL(ev.target.result, (img) => {
        img.scaleToWidth(220);
        img.set({ left: 100, top: 100, id: `img-${Date.now()}` });
        canvas.add(img).setActiveObject(img);
        canvas.requestRenderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  const bringForward = () => {
    const o = canvas.getActiveObject();
    if (o) canvas.bringForward(o);
  };
  const sendBack = () => {
    const o = canvas.getActiveObject();
    if (o) canvas.sendBackwards(o);
  };
  const remove = () => {
    const o = canvas.getActiveObject();
    if (o) {
      canvas.remove(o);
    }
  };
  const rotate = (deg) => {
    const o = canvas.getActiveObject();
    if (o) {
      o.rotate((o.angle || 0) + deg);
      canvas.requestRenderAll();
    }
  };
  const scaleUp = () => {
    const o = canvas.getActiveObject();
    if (o) {
      o.scaleX *= 1.1;
      o.scaleY *= 1.1;
      canvas.requestRenderAll();
    }
  };
  const scaleDown = () => {
    const o = canvas.getActiveObject();
    if (o) {
      o.scaleX *= 0.9;
      o.scaleY *= 0.9;
      canvas.requestRenderAll();
    }
  };

  const setFill = (e) => {
    const o = canvas.getActiveObject();
    if (o && o.set) {
      o.set("fill", e.target.value);
      canvas.requestRenderAll();
    }
  };

  return (
    <div className="w-64">
      <div className="mb-2">
        <input
          className="w-full border p-2 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={addText}
          className="mt-2 w-full py-1 bg-sky-600 text-white rounded"
        >
          Add Text
        </button>
      </div>

      <div className="mb-2">
        <label className="block text-sm">Upload Image</label>
        <input type="file" accept="image/*" onChange={addImage} />
      </div>

      <div className="flex gap-2 mb-2">
        <button onClick={() => rotate(15)} className="px-2 py-1 border rounded">
          Rotate +15
        </button>
        <button
          onClick={() => rotate(-15)}
          className="px-2 py-1 border rounded"
        >
          -15
        </button>
      </div>

      <div className="flex gap-2 mb-2">
        <button onClick={scaleUp} className="px-2 py-1 border rounded">
          Scale +
        </button>
        <button onClick={scaleDown} className="px-2 py-1 border rounded">
          -
        </button>
      </div>

      <div className="flex gap-2 mb-2">
        <button onClick={bringForward} className="px-2 py-1 border rounded">
          Bring F
        </button>
        <button onClick={sendBack} className="px-2 py-1 border rounded">
          Send B
        </button>
        <button onClick={remove} className="px-2 py-1 border rounded">
          Remove
        </button>
      </div>

      <div className="mb-2">
        <label className="text-sm block">Fill color</label>
        <input type="color" onChange={setFill} />
      </div>
    </div>
  );
}
