import { Text, Transformer } from "react-konva";
import { useRef, useEffect, useState } from "react";

export default function TextNodeBrowser({ shapeProps, isSelected, onChange }) {
  const shapeRef = useRef();
  const trRef = useRef();
  const [editor, setEditor] = useState(false);

  /* transformer */
  useEffect(() => {
    if (isSelected && shapeRef.current && !editor) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, editor]);

  /* ---------- editor ---------- */
  useEffect(() => {
    if (!editor) return;
    const ta = document.getElementById(`ed-${shapeProps.id}`);
    if (!ta) return;
    ta.focus();
    ta.select();

    const save = () => {
      onChange({ text: ta.value });
      setEditor(false);
    };

    ta.onkeydown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        save();
      }
      if (e.key === "Escape") setEditor(false);
    };
    ta.onblur = save;

    return () => (ta.onkeydown = ta.onblur = null);
  }, [editor, shapeProps.id, onChange]);

  /* exit if another object selected */
  useEffect(() => {
    if (editor && !isSelected) setEditor(false);
  }, [isSelected, editor]);

  const stage = shapeRef.current?.getStage();
  const scale = stage ? stage.scaleX() : 1;
  const box = shapeRef.current?.getClientRect() || {
    x: shapeProps.x,
    y: shapeProps.y,
    width: 200,
    height: 30,
  };

  return (
    <>
      {/* ghost while editing */}
      {editor && <Text {...shapeProps} opacity={0.3} listening={false} />}

      {/* real text */}
      {!editor && (
        <>
          <Text
            ref={shapeRef}
            {...shapeProps}
            draggable
            onDblClick={() => setEditor(true)}
            onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
            onTransformEnd={(e) => {
              const n = e.target;
              onChange({
                x: n.x(),
                y: n.y(),
                rotation: n.rotation(),
                scaleX: n.scaleX(),
                scaleY: n.scaleY(),
                width: n.width() * n.scaleX(),
                height: n.height() * n.scaleY(),
              });
            }}
          />
        </>
      )}

      {/* textarea overlay */}
      {editor && (
        <foreignObject
          x={shapeProps.x}
          y={shapeProps.y}
          width={(shapeProps.width || 200) * (shapeProps.scaleX || 1)}
          height={(shapeProps.height || 30) * (shapeProps.scaleY || 1)}
          scaleX={shapeProps.scaleX || 1}
          scaleY={shapeProps.scaleY || 1}
          rotation={shapeProps.rotation || 0}
          offsetX={shapeProps.offsetX || 0}
          offsetY={shapeProps.offsetY || 0}
        >
          <textarea
            id={`ed-${shapeProps.id}`}
            style={{
              width: "100%",
              height: "100%",
              fontSize: `${shapeProps.fontSize}px`,
              fontFamily: shapeProps.fontFamily,
              color: shapeProps.fill,
              background: "#fff",
              border: "1px solid #0077ff",
              padding: 2,
              resize: "none",
              outline: "none",
              lineHeight: 1,
            }}
            defaultValue={shapeProps.text}
            autoFocus
          />
        </foreignObject>
      )}
      {isSelected && !editor && <Transformer ref={trRef} />}
    </>
  );
}
