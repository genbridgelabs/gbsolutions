import { connectDB } from "@/lib/mongodb";
import { Lead } from "@/lib/models/lead";

export function buildLeadQuery({ q = "", status = "all", type = "all" } = {}) {
  const query = {};

  if (status && status !== "all") query.status = status;
  if (type && type !== "all") query.projectType = type;

  const term = String(q || "").trim().slice(0, 80);
  if (term) {
    const safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rx = new RegExp(safe, "i");
    query.$or = [
      { name: rx },
      { phone: rx },
      { email: rx },
      { city: rx },
      { message: rx },
    ];
  }

  return query;
}

export function serializeLead(doc) {
  return {
    id: String(doc._id),
    name: doc.name || "",
    phone: doc.phone || "",
    email: doc.email || "",
    projectType: doc.projectType || "",
    city: doc.city || "",
    budget: doc.budget || "",
    message: doc.message || "",
    status: doc.status || "new",
    adminNote: doc.adminNote || "",
    source: doc.source || "website",
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
  };
}

export async function listLeads({
  q = "",
  status = "all",
  type = "all",
  page = 1,
  perPage = 25,
} = {}) {
  await connectDB();

  const safePage = Math.max(1, Number(page) || 1);
  const query = buildLeadQuery({ q, status, type });

  const [items, total] = await Promise.all([
    Lead.find(query)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * perPage)
      .limit(perPage)
      .lean(),
    Lead.countDocuments(query),
  ]);

  return {
    items: items.map(serializeLead),
    total,
    page: safePage,
    perPage,
    pages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function allLeadsForExport({ q = "", status = "all", type = "all" } = {}) {
  await connectDB();
  const items = await Lead.find(buildLeadQuery({ q, status, type }))
    .sort({ createdAt: -1 })
    .lean();
  return items.map(serializeLead);
}

export async function leadStats() {
  await connectDB();

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 864e5);
  const twoWeeksAgo = new Date(now.getTime() - 13 * 864e5);
  twoWeeksAgo.setHours(0, 0, 0, 0);

  const [total, fresh, week, quoted, recent] = await Promise.all([
    Lead.countDocuments({}),
    Lead.countDocuments({ status: "new" }),
    Lead.countDocuments({ createdAt: { $gte: weekAgo } }),
    Lead.countDocuments({ status: { $in: ["quoted", "won"] } }),
    Lead.find({ createdAt: { $gte: twoWeeksAgo } })
      .select("createdAt")
      .lean(),
  ]);

  const days = [];
  for (let i = 13; i >= 0; i--) {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - i);
    const end = new Date(start.getTime() + 864e5);
    days.push({
      date: start.toISOString(),
      count: recent.filter((item) => {
        const created = new Date(item.createdAt);
        return created >= start && created < end;
      }).length,
    });
  }

  return { total, fresh, week, quoted, days };
}
