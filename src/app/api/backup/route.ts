import { NextResponse } from "next/server";
import { getAdminSession } from "@/actions/auth.actions";
import { getDatabaseBackupPayload } from "@/actions/maintenance.actions";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backupData = await getDatabaseBackupPayload();
  const dateStr = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `backup_portal_pengumuman_${dateStr}.json`;

  return new NextResponse(JSON.stringify(backupData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
