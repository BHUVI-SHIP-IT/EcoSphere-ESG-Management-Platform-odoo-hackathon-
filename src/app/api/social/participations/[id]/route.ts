import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { status } = await req.json();

  if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const updated = await prisma.participation.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ success: true, participation: updated });
  } catch (err) {
    console.error("Failed to update participation:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}