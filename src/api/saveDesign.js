import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { design } = req.body;
  const id = nanoid();
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  const file = path.join(dataDir, `${id}.json`);
  fs.writeFileSync(
    file,
    JSON.stringify({ id, design, createdAt: new Date().toISOString() }, null, 2)
  );
  res.status(200).json({ id });
}
