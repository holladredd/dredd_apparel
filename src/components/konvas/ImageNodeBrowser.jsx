import { useRef, useEffect } from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";

export default function ImageNodeBrowser({ shapeProps, isSelected, onChange }) {
  const [image] = useImage(shapeProps.imageUrl);
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, image]);

  if (!image) return null;

  return (
    <>
      <Image
        ref={shapeRef}
        image={image}
        {...shapeProps}
        draggable
        onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
        onTransformEnd={(e) => {
          const node = e.target;
          onChange({
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
}
