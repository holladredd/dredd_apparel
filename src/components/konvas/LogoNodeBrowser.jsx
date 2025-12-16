import { useRef, useEffect } from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";
import Konva from "konva";

export default function LogoNodeBrowser({ shapeProps, isSelected, onChange }) {
  const [image, status] = useImage(shapeProps.imageUrl, "anonymous");
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    if (status === "loaded" && shapeRef.current) {
      if (shapeProps.colorize) {
        shapeRef.current.cache();
      } else {
        shapeRef.current.clearCache();
      }
      shapeRef.current.getLayer().batchDraw();
    }
  }, [
    status,
    shapeProps.colorize,
    shapeProps.colorizeRed,
    shapeProps.colorizeGreen,
    shapeProps.colorizeBlue,
  ]);

  if (status !== "loaded") return null;

  return (
    <>
      <Image
        ref={shapeRef}
        image={image}
        {...shapeProps}
        draggable={shapeProps.draggable}
        onDragEnd={(e) => {
          if (shapeProps.draggable) {
            onChange({ x: e.target.x(), y: e.target.y() });
          }
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
        filters={
          shapeProps.colorize
            ? [Konva.Filters.Grayscale, Konva.Filters.Colorize]
            : undefined
        }
        colorizeRed={shapeProps.colorizeRed}
        colorizeGreen={shapeProps.colorizeGreen}
        colorizeBlue={shapeProps.colorizeBlue}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}
