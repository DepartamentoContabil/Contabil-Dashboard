export default async function handler(req, res) {
  const { url } = req.query;
  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "Missing url param" });
    return;
  }
  try {
    const r = await fetch(url, {
      headers: { Accept: "text/csv,*/*" },
      redirect: "follow",
    });
    const text = await r.text();
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(text);
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
}