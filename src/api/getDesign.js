import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) return res.status(200).json([]);
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));
  const items = files.map((f) =>
    JSON.parse(fs.readFileSync(path.join(dataDir, f), "utf8"))
  );
  res.status(200).json(items);
}
