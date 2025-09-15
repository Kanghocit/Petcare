import Comment from "../models/Comment.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/user.js";
import { getIo } from "../socket/index.js";

export const createComment = async (req, res) => {
  try {
    const { productSlug } = req.params;
    const { userId, content, rating, parentId } = req.body;
    const product = await Product.findOne({ slug: productSlug });

    if (!product) {
      console.log("Sản phẩm không tồn tại");
      return res.status(400).json({ message: "Sản phẩm không tồn tại" });
    }

    const order = await Order.findOne({
      "items.product": product._id,
      user: userId,
    });

    if (!order) {
      console.log("Bạn chưa mua sản phẩm này");
      return res.status(400).json({
        ok: false,
        message: parentId
          ? "Chỉ những người đã mua mới được reply bình luận"
          : "Chỉ những người đã mua mới được đánh giá sản phẩm",
      });
    }

    const comment = await Comment.create({
      productId: product._id,
      userId,
      content,
      rating,
      parentId: parentId === "" ? null : parentId,
      status: "active",
    });
    // enrich for realtime consumers
    await comment.populate("userId", "name");

    const io = getIo();
    if (io)
      io.emit("new-comment", {
        productSlug: product.slug,
        comment,
      });

    res.status(201).json({
      ok: true,
      message: "Tạo bình luận thành công",
      comment,
    });
  } catch (error) {
    console.log("Tạo bình luận thất bại", error);
    res.status(500).json({
      ok: false,
      message: "Tạo bình luận thất bại",
      error: error.message,
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const { productSlug } = req.params;
    const product = await Product.findOne({ slug: productSlug });
    if (!product) {
      return res.status(400).json({ message: "Sản phẩm không tồn tại" });
    }

    // Lấy tất cả comments của sản phẩm
    const allComments = await Comment.find({ productId: product._id })
      .populate("userId", "name")
      .sort({
        createdAt: -1,
      });

    // Tách comments gốc và replies
    const parentComments = allComments.filter((comment) => !comment.parentId);
    const replies = allComments.filter((comment) => comment.parentId);

    // Gộp replies vào parent comments
    const commentsWithReplies = parentComments.map((parentComment) => {
      const commentReplies = replies.filter(
        (reply) => reply.parentId.toString() === parentComment._id.toString()
      );

      return {
        ...parentComment.toObject(),
        replies: commentReplies,
      };
    });

    res.status(200).json({
      ok: true,
      message: "Lấy bình luận thành công",
      comments: commentsWithReplies,
    });
  } catch (error) {
    console.log("Lấy bình luận thất bại", error);
    res.status(500).json({
      ok: false,
      message: "Lấy bình luận thất bại",
      error,
    });
  }
};

export const getCommentsInAdmin = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    // Only paginate root comments to match admin UI
    const comments = await Comment.find({ parentId: null })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name")
      .populate("productId", "title slug");

    const total = await Comment.countDocuments({ parentId: null });
    const totalPages = Math.ceil(total / limit);
    return res.status(200).json({
      ok: true,
      message: "Lấy bình luận thành công",
      comments,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.log("Lấy bình luận thất bại", error);
    return res.status(500).json({
      ok: false,
      message: "Lấy bình luận thất bại",
      error: error.message,
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id, content, rating, userId } = req.body;

    // Lấy comment hiện tại để check parentId và userId
    const commentInDb = await Comment.findById(id);

    if (!commentInDb) {
      return res
        .status(404)
        .json({ ok: false, message: "Comment không tồn tại" });
    }

    // Kiểm tra quyền chỉnh sửa: cho phép cập nhật nếu là reply (admin reply),
    // còn lại yêu cầu đúng userId
    if (!commentInDb.parentId) {
      if (!userId || commentInDb.userId.toString() !== userId) {
        return res.status(403).json({
          ok: false,
          message: "Bạn không có quyền chỉnh sửa bình luận này",
        });
      }
    }

    // Nếu là comment gốc, bắt buộc rating
    if (!commentInDb.parentId && rating === undefined) {
      return res.status(400).json({
        ok: false,
        message: "Rating là bắt buộc cho comment gốc",
      });
    }

    // Chỉ update rating nếu tồn tại
    const updateData = { content };
    if (rating !== undefined) updateData.rating = rating;

    const updatedComment = await Comment.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      message: "Cập nhật bình luận thành công",
      comment: updatedComment,
    });
  } catch (error) {
    console.log("Cập nhật bình luận thất bại", error);
    res.status(500).json({
      ok: false,
      message: "Cập nhật bình luận thất bại",
      error: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.body;

    // Lấy comment hiện tại để check userId
    const commentInDb = await Comment.findById(id);

    if (!commentInDb) {
      return res
        .status(404)
        .json({ ok: false, message: "Comment không tồn tại" });
    }

    await Comment.findByIdAndDelete(id);
    res.status(200).json({
      ok: true,
      message: "Xóa bình luận thành công",
    });
  } catch (error) {
    console.log("Xóa bình luận thất bại", error);
    res.status(500).json({
      ok: false,
      message: "Xóa bình luận thất bại",
      error: error.message,
    });
  }
};

export const replyComment = async (req, res) => {
  try {
    const { parentId, content } = req.body;

    // Kiểm tra parent comment có tồn tại không
    const parentComment = await Comment.findById(parentId).populate(
      "productId",
      "title slug"
    );

    if (!parentComment) {
      return res.status(404).json({
        ok: false,
        message: "Bình luận gốc không tồn tại",
      });
    }

    // Tìm hoặc tạo admin user
    let adminUser = await User.findOne({ role: "admin" });
    // if (!adminUser) {
    //   adminUser = await User.create({
    //     name: "Admin",
    //     email: "admin@petcare.com",
    //     username: "admin",
    //     password: "admin123",
    //     role: "admin",
    //     isVerified: true,
    //   });
    // }

    // Tạo reply comment
    const reply = await Comment.create({
      productId: parentComment.productId._id,
      userId: adminUser._id,
      content,
      parentId: parentId,
    });

    await Comment.findByIdAndUpdate(parentId, { isReply: true });

    // Populate thông tin user và product
    await reply.populate("userId", "name");
    await reply.populate("productId", "title slug");

    const io = getIo();
    if (io)
      io.emit("new-reply", {
        productSlug: parentComment.productId.slug,
        reply: {
          ...reply.toObject(),
          parentId: parentId.toString?.() || String(parentId),
        },
      });

    res.status(201).json({
      ok: true,
      message: "Phản hồi thành công",
      comment: reply,
    });
  } catch (error) {
    console.log("Phản hồi thất bại", error);
    res.status(500).json({
      ok: false,
      message: "Phản hồi thất bại",
      error: error.message,
    });
  }
};

export const updateCommentStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.status(200).json({
      ok: true,
      message: "Cập nhật trạng thái bình luận thành công",
      comment,
    });
  } catch (error) {
    console.log("Cập nhật trạng thái bình luận thất bại", error);
    res.status(500).json({
      ok: false,
      message: "Cập nhật trạng thái bình luận thất bại",
      error: error.message,
    });
  }
};
