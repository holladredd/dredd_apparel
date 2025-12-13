export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { dataURL } = req.body;

  return res
    .status(200)
    .json({ message: "Saved temporarily!", preview: dataURL });
}
