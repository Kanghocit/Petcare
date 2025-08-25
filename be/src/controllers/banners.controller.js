import Banner from "../models/Banner.js";

export const createBanner = async (req, res) => {
  try {
    const { title, sort, image } = req.body;
    const banner = await Banner.create({ title, sort, image });
    res.status(201).json({
      ok: true,
      message: "Tạo banner thành công",
      banner,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Tạo banner thất bại",
      error,
    });
  }
};
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ sort: 1 });
    res.status(200).json({
      ok: true,
      message: "Lấy banner thành công",
      banners,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Lấy banner thất bại",
      error,
    });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, sort, image } = req.body;

    const current = await Banner.findById(id);
    if (!current) {
      return res
        .status(404)
        .json({ ok: false, message: "Banner không tồn tại" });
    }

    // Nếu có cập nhật sort thì reindex lại
    if (sort !== undefined && sort !== current.sort) {
      if (sort < current.sort) {
        // dịch các banner từ sort mới → sort cũ - 1 lên +1
        await Banner.updateMany(
          { sort: { $gte: sort, $lt: current.sort }, _id: { $ne: id } },
          { $inc: { sort: 1 } }
        );
      } else {
        // dịch các banner từ sort cũ + 1 → sort mới xuống -1
        await Banner.updateMany(
          { sort: { $gt: current.sort, $lte: sort }, _id: { $ne: id } },
          { $inc: { sort: -1 } }
        );
      }
      current.sort = sort;
    }

    if (title !== undefined) current.title = title;
    if (image !== undefined) current.image = image;

    await current.save();

    res.status(200).json({
      ok: true,
      message: "Cập nhật banner thành công",
      banner: current,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Cập nhật banner thất bại",
      error: error.message,
    });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    await Banner.findByIdAndDelete(id);

    const banners = await Banner.find().sort({ sort: 1 });
    const ops = banners.map((b, idx) => ({
      updateOne: {
        filter: { _id: b._id },
        update: { $set: { sort: idx + 1 } },
      },
    }));

    if (ops.length > 0) {
      await Banner.bulkWrite(ops);
    }

    res.status(200).json({
      ok: true,
      message: "Xóa banner thành công",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Xóa banner thất bại",
      error: error.message,
    });
  }
};
