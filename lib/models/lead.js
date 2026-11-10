import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 32 },
    email: { type: String, default: "", trim: true, lowercase: true, maxlength: 160 },
    projectType: { type: String, default: "Full home turnkey", trim: true, maxlength: 80 },
    city: { type: String, default: "Bhubaneswar", trim: true, maxlength: 80 },
    budget: { type: String, default: "Not decided yet", trim: true, maxlength: 80 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    // Snapshot of what the site estimator showed, kept with the enquiry so the
    // desk sees the same range the visitor did.
    estimate: {
      scope: { type: String, default: "" },
      size: { type: String, default: "" },
      style: { type: String, default: "" },
      work: { type: String, default: "" },
      area: { type: Number, default: 0 },
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      summary: { type: String, default: "" },
    },
    source: { type: String, default: "website", enum: ["website", "estimator", "phone"] },
    status: {
      type: String,
      default: "new",
      enum: ["new", "contacted", "quoted", "won", "lost"],
    },
    adminNote: { type: String, default: "", maxlength: 2000 },
    ipHash: { type: String, default: "" },
  },
  { timestamps: true }
);

LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ status: 1, createdAt: -1 });

export const Lead = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
