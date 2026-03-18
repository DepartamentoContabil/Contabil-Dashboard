import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/csv-proxy", async (req, res) => {
  const { url } = req.query;
  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "Missing url param" });
    return;
  }
  try {
    const response = await fetch(url, {
      headers: { "Accept": "text/csv,text/plain,*/*" },
      redirect: "follow",
    });
    if (!response.ok) {
      res.status(response.status).json({ error: "Upstream error", status: response.status });
      return;
    }
    const text = await response.text();
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.send(text);
  } catch (err: any) {
    res.status(500).json({ error: "Fetch failed", message: err?.message });
  }
});

export default router;
