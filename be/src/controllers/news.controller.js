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
    // Ép kiểu về số và đảm bảo giá trị hợp lệ
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 10;
    const search = req.query.search || "";
    const status = req.query.status || "";

    const skip = (page - 1) * limit;

    const query = {
      title: { $regex: search, $options: "i" },
      ...(status && { status: status }),
    };

    const news = await News.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await News.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      message: "Lấy tin thành công",
      ok: true,
      news,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("❌ Lỗi lấy tin:", error.message);
    res.status(500).json({ message: "Lỗi lấy tin", ok: false });
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
      .sort({ createdAt: -1 });
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
