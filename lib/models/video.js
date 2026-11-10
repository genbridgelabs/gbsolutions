import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    place: { type: String, default: "", trim: true, maxlength: 80 },
    recordedOn: { type: String, default: "", trim: true, maxlength: 40 },
    duration: { type: String, default: "", trim: true, maxlength: 12 },
    note: { type: String, default: "", trim: true, maxlength: 300 },
    description: { type: String, default: "", trim: true, maxlength: 800 },
    poster: { type: String, required: true, trim: true, maxlength: 600 },
    posterAlt: { type: String, default: "", trim: true, maxlength: 200 },
    source: {
      type: String,
      enum: ["file", "youtube", "vimeo"],
      default: "file",
    },
    src: { type: String, required: true, trim: true, maxlength: 600 },
    order: { type: Number, default: 0, min: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

VideoSchema.index({ published: 1, order: 1 });
VideoSchema.index({ order: 1, createdAt: 1 });

export const Video = mongoose.models.Video || mongoose.model("Video", VideoSchema);
