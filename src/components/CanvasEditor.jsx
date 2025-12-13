"use client";
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import EditorToolbar from "./EditorToolbar";
import LayersPanel from "./LayersPanel";
import { saveAs } from 'file-saver';


export default function CanvasEditor({ template }) {
const canvasRef = useRef(null);
const [canvas, setCanvas] = useState(null);
const [objects, setObjects] = useState([]);


useEffect(() => {
const c = new fabric.Canvas('designer-canvas', { height: 700, width: 600, backgroundColor: '#fff' });


// Add grid or background
c.on('object:added', updateObjects);
c.on('object:removed', updateObjects);
c.on('object:modified', updateObjects);


// Load template if provided
const url = template || '/templates/shirt.svg';
fabric.loadSVGFromURL(url, (objectsFromSvg, options) => {
if (!objectsFromSvg.length) return;
const obj = fabric.util.groupSVGElements(objectsFromSvg, options);
obj.selectable = false; // template base locked by default
obj.id = 'base-template';
obj.scaleToWidth(400);
obj.set({ left: 100, top: 50 });
c.clear();
c.add(obj);
c.renderAll();
updateObjects();
}, (err) => {
console.warn('failed to load svg', err);
});


canvasRef.current = c;
setCanvas(c);


return () => {
c.dispose();
};


function updateObjects() {
setObjects(c.getObjects().map(o => ({ id: o.id || o.name || o.type, type: o.type })));
}
}, [template]);


// Export PNG
const exportPNG = () => {
if (!canvas) return;
const dataURL = canvas.toDataURL({ format: 'png', multiplier: 2 });
const link = document.createElement('a');
link.href = dataURL;
link.download = 'design.png';
link.click();
};


// Save to server
const saveDesign = async () => {
if (!canvas) return;
const json = canvas.toJSON(['id']);
const resp = await fetch('/api/saveDesign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ design: json }) });
const data = await resp.json();
alert('Saved: ' + data.id);
};


return (
<div className="bg-white p-4 rounded shadow">
<div className="flex items-center justify-between mb-3">
<h2 className="text-lg font-semibold">Designer</h2>
<div className="flex gap-2">
<button onClick={exportPNG} className="px-3 py-1 border rounded">Download PNG</button>
<button onClick={saveDesign} className="px-3 py-1 bg-sky-600 text-white rounded">Save</button>
</div>
</div>


<div className="flex gap-4">
<div>
<EditorToolbar canvas={canvas} />
</div>
<div>
<canvas id="designer-canvas" />
}