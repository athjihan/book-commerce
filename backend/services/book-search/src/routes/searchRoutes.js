const redisClient = require("../config/redis");

router.get("/", async (req, res) => {
  try {
    const query = {};

    if (!req.query.title && !req.query.author) {
      return res.status(400).json({ error: "Tidak ada title atau author untuk pencarian." });
    }

    const title = req.query.title?.toLowerCase() || "";
    const author = req.query.author?.toLowerCase() || "";
    const cacheKey = `search:${title}:${author}`;

    // Cek cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("📦 Hasil dari cache");
      return res.json(JSON.parse(cached));
    }

    if (req.query.title && typeof req.query.title === "string") {
      if (req.query.title.length > 100) {
        return res.status(400).json({ error: "Judul terlalu panjang." });
      }
      query.title = { $regex: req.query.title, $options: "i" };
    }

    if (req.query.author && typeof req.query.author === "string") {
      if (req.query.author.length > 100) {
        return res.status(400).json({ error: "Nama penulis terlalu panjang." });
      }
      query.author = { $regex: req.query.author, $options: "i" };
    }

    const books = await Book.find(query);

    // Simpan ke cache selama 1 minggu (7 hari x 24 jam x 60 menit x 60 detik = 604800 detik)
    await redisClient.setEx(cacheKey, 604800, JSON.stringify(books));

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
