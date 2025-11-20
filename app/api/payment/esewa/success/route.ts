import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

/**
 * Build signature message using signed_field_names from eSewa
 */
function buildMessage(data: any) {
  const fields = data.signed_field_names.split(",");
  return fields.map((field: string) => `${field}=${data[field]}`).join(",");
}

function verifyEsewaSignature(secretKey: string, message: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");

  return expected === signature;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawData = searchParams.get("data");

    if (!rawData) {
      return NextResponse.json({ message: "Missing data" }, { status: 400 });
    }

    // Decode Base64 from eSewa
    const decoded = Buffer.from(rawData, "base64").toString("utf8");
    const data = JSON.parse(decoded);

    const secretKey = "8gBm/:&EnhH.1/q"; // Sandbox key

    const message = buildMessage(data);
    const isValid = verifyEsewaSignature(secretKey, message, data.signature);

    if (!isValid) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    const { transaction_uuid, total_amount, status } = data;

    // 🔥 Find payment based on transaction_uuid
    const payment = await prisma.payment.findFirst({
  where: { transaction_uuid },
});


    if (!payment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }

    const ticketId = payment.ticket_id;   // Correct mapping

    // 🔥 Update payment status
    await prisma.payment.update({
      where: { transaction_uuid },
      data: {
        payment_status: status === "COMPLETE" ? "SUCCESS" : "FAILED",
        amount: Number(total_amount),
      },
    });

    // 🔥 Mark ticket as purchased
    if (status === "COMPLETE") {
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { isPurchased: true },
      });
    }

    // Redirect
    return NextResponse.redirect(
      `http://localhost:3000/payment/esewa/success?ticketId=${ticketId}`
    );

  } catch (error: any) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
