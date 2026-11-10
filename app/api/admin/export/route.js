import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { allLeadsForExport } from "@/lib/leads";
import { formatIST } from "@/lib/format";

const header = [
  "Reference",
  "Received (IST)",
  "Name",
  "Phone",
  "Email",
  "Project type",
  "Location",
  "Budget",
  "Status",
  "Source",
  "Message",
  "Studio note",
];

export async function GET(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filters = {
    q: searchParams.get("q") || "",
    status: searchParams.get("status") || "all",
    type: searchParams.get("type") || "all",
  };

  try {
    const leads = await allLeadsForExport(filters);

    const rows = leads.map((lead) => ({
      Reference: `GB-${lead.id.slice(-5).toUpperCase()}`,
      "Received (IST)": formatIST(lead.createdAt),
      Name: lead.name,
      Phone: lead.phone,
      Email: lead.email,
      "Project type": lead.projectType,
      Location: lead.city,
      Budget: lead.budget,
      Status: lead.status,
      Source: lead.source,
      Message: lead.message,
      "Studio note": lead.adminNote,
    }));

    const sheet = XLSX.utils.json_to_sheet(rows, { header });
    sheet["!cols"] = [
      { wch: 11 },
      { wch: 20 },
      { wch: 22 },
      { wch: 16 },
      { wch: 28 },
      { wch: 24 },
      { wch: 22 },
      { wch: 18 },
      { wch: 11 },
      { wch: 10 },
      { wch: 62 },
      { wch: 42 },
    ];
    sheet["!autofilter"] = {
      ref: XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: rows.length + 1, c: header.length - 1 },
      }),
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Enquiries");

    const summary = XLSX.utils.aoa_to_sheet([
      ["GB Solutions — enquiry export"],
      ["Generated", formatIST(new Date())],
      ["Rows", String(rows.length)],
      ["Search", filters.q || "none"],
      ["Status filter", filters.status],
      ["Project filter", filters.type],
    ]);
    summary["!cols"] = [{ wch: 22 }, { wch: 44 }];
    XLSX.utils.book_append_sheet(workbook, summary, "About this file");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    const stamp = new Date().toISOString().slice(0, 10);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="gb-solutions-enquiries-${stamp}.xlsx"`,
        "Cache-Control": "no-store, max-age=0",
        "Content-Length": String(buffer.length),
      },
    });
  } catch (error) {
    console.error("admin: export failed", error?.message);
    return NextResponse.json(
      { error: "Could not build the workbook. Try again." },
      { status: 503 }
    );
  }
}
