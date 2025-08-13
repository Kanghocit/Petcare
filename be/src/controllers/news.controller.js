import News from "../models/News.js";
import scrapeNews from "../services/scrape.services.js";

export const scrapeAndSaveNews = async () => {
  const newsList = await scrapeNews(
    `https://vnexpress.net/chu-de/thu-cung-6644-p${
      Math.floor(Math.random() * 20) + 1
    }`
  );
  let saved = 0;

  for (const item of newsList) {
    const exists = await News.findOne({ title: item.title });
    if (!exists) {
      try {
        // Extract blocks, author, publishTime từ child object
        const newsData = {
          title: item.title,
          content: item.content,
          image: item.image,
          link: item.link,
          blocks: item.child?.blocks || [],
          author: item.child?.author || "",
          publishTime: item.child?.publishTime || "",
        };

        await News.create(newsData);
        saved++;
      } catch (err) {
        console.error("❌ Lỗi lưu:", err.message);
      }
    }
  }

  console.log(`Đã lưu ${saved} tin mới.`);
};

//lấy tất cả tin
export const getAllNews = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const searchRaw = (req.query.search || "").trim();
    const status = (req.query.status || "").trim();

    // Escape ký tự đặc biệt trong regex
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const query = {
      ...(searchRaw && {
        title: { $regex: new RegExp(escapeRegex(searchRaw), "i") },
      }),
      ...(status && { status }),
    };

    const skip = (page - 1) * limit;

    // chạy song song để nhanh hơn
    const [news, total] = await Promise.all([
      News.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "_id title slug content image author publishTime status createdAt"
        ) // chỉ ví dụ, tùy bạn
        .lean(),
      News.countDocuments(query),
    ]);

    return res.json({
      ok: true,
      message: "Lấy tin thành công",
      news,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ Lỗi lấy tin:", error);
    return res.status(500).json({ ok: false, message: "Lỗi lấy tin" });
  }
};

//lấy tin theo trạng thái
export const getNewsByStatus = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  try {
    const skip = (page - 1) * limit;
    const news = await News.find({ status })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
    res.json({ message: "Lấy tin thành công", ok: true, news });
  } catch (error) {
    console.error("❌ Lỗi lấy tin:", error.message);
    res.status(500).json({ message: "Lỗi lấy tin", ok: false });
  }
};

export const updateNews = async (req, res) => {
  const { slug } = req.params;
  const updateData = req.body;

  try {
    // Kiểm tra xem tin tức có tồn tại không
    const existingNews = await News.findOne({ slug });
    if (!existingNews) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy tin tức", ok: false });
    }

    const news = await News.findOneAndUpdate({ slug }, updateData, {
      new: true,
    });

    res.json({ message: "Cập nhật tin thành công", ok: true, news });
  } catch (error) {
    console.error("❌ Lỗi cập nhật tin:", error.message);
    res.status(500).json({ message: "Lỗi cập nhật tin", ok: false });
  }
};

export const deleteNews = async (req, res) => {
  const { slug } = req.params;
  try {
    const news = await News.findOneAndDelete({ slug });
    if (!news) {
      res.status(404).json({ message: "Không tìm thấy tin", ok: false });
    }
    res.json({ message: "Xóa tin thành công", ok: true, news });
  } catch (error) {
    console.error("❌ Lỗi xóa tin:", error.message);
    res.status(500).json({ message: "Lỗi xóa tin", ok: false });
  }
};

export const getNewsBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const news = await News.findOne({ slug });
    res.json({ message: "Lấy tin thành công", ok: true, news });
  } catch (error) {
    console.error("❌ Lỗi lấy tin:", error.message);
    res.status(500).json({ message: "Lỗi lấy tin", ok: false });
  }
};
