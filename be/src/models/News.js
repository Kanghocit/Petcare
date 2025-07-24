import mongoose from "mongoose";
import slugify from "slugify";
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
  },
  { timestamps: true }
);

newsSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  const rawTitle = this.title.replace(/[^\w\s]/gi, "");
  const words = rawTitle.trim().split(/\s+/);

  this.slug =
    slugify(words.length > 6 ? words.slice(0, 6).join("-") : rawTitle, {
      lower: true,
      strict: true,
    }) +
    "-" +
    nanoid(5); // đảm bảo không trùng slug

  next();
});

export default mongoose.models.News || mongoose.model("News", newsSchema);
