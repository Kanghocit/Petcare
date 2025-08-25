import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    sort: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

bannerSchema.pre("save", async function (next) {
  if (this.isNew && (this.sort === undefined || this.sort === 0)) {
    const maxSort = await this.constructor
      .findOne()
      .sort("-sort")
      .select("sort");
    this.sort = maxSort ? maxSort.sort + 1 : 1;
  }
  next();
});

const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);

export default Banner;
