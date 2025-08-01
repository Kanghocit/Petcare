import mongoose from "mongoose";
import slugify from "@sindresorhus/slugify";
import { nanoid } from "nanoid";

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
    },
    image: {
      type: String,
    },
    link: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "active"],
      default: "pending",
    },
    author: {
      type: String,
    },
    publishTime: {
      type: String,
      // Cho phép tên ngày bằng tiếng Việt và tháng có thể 1-2 chữ số
      match: /^.+?, \d{1,2}\/\d{1,2}\/\d{4}, \d{2}:\d{2} \(GMT\+\d{1,2}\)$/,
    },
    blocks: [
      {
        text: {
          type: String,
        },
        image: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

newsSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  const shortened = this.title.trim().split(/\s+/).slice(0, 6).join(" ");

  this.slug =
    (await slugify(shortened, {
      lowercase: true,
    })) +
    "-" +
    nanoid(5);

  next();
});

export default mongoose.models.News || mongoose.model("News", newsSchema);
