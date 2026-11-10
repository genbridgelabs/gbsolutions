import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true, maxlength: 600 },
    alt: { type: String, default: "", trim: true, maxlength: 200 },
    caption: { type: String, default: "", trim: true, maxlength: 200 },
  },
  { _id: false }
);

const GalleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, trim: true, lowercase: true, maxlength: 80, default: "" },
    category: {
      type: String,
      enum: ["Homes", "Workspaces", "Hospitality", "Details"],
      default: "Homes",
    },
    typeLabel: { type: String, default: "", trim: true, maxlength: 40 },
    place: { type: String, default: "Bhubaneswar", trim: true, maxlength: 80 },
    year: { type: String, default: "", trim: true, maxlength: 4 },
    summary: { type: String, default: "", trim: true, maxlength: 300 },
    description: { type: String, default: "", trim: true, maxlength: 1200 },
    cover: { type: String, required: true, trim: true, maxlength: 600 },
    coverAlt: { type: String, default: "", trim: true, maxlength: 200 },
    images: { type: [ImageSchema], default: [] },
    order: { type: Number, default: 0, min: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

GalleryItemSchema.index({ published: 1, order: 1 });
GalleryItemSchema.index({ order: 1, createdAt: 1 });
GalleryItemSchema.index({ slug: 1 }, { unique: true, sparse: true });

export const GalleryItem =
  mongoose.models.GalleryItem ||
  mongoose.model("GalleryItem", GalleryItemSchema);
