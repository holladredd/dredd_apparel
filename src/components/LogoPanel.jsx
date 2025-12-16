import React from "react";
import { nanoid } from "nanoid";

const LogoPanel = ({ onSelectLogo }) => {
  // In a real app, you'd fetch these from a server or have a more robust system.
  const logos = [
    "/logo templates/duplexide logo sample.svg",
    "/logo templates/fortysecondstreethb logo sample.svg",
    "/logo templates/monotom logo sample.svg",
  ];

  const handleSelectLogo = (logoSrc) => {
    const newImage = {
      id: nanoid(),
      component: "Image",
      src: logoSrc,
      x: 50,
      y: 50,
    };
    setObjects((prevObjects) => [...prevObjects, newImage]);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-4">Logos</h3>
      <div className="grid grid-cols-2 gap-4">
        {logos.map((logo, index) => (
          <div
            key={index}
            className="border rounded-lg p-2 cursor-pointer hover:bg-gray-200"
            onClick={() => onSelectLogo(logo)}
          >
            <img
              src={logo}
              alt={`Logo ${index + 1}`}
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoPanel;
