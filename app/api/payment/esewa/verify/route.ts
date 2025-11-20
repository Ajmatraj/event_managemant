// POST /api/payment/esewa/verify
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    console.log("🔥 VERIFY API HIT");

    const body = await req.json();
    console.log("📩 RAW BODY:", body);

    const { data } = body;

    if (!data) {
      console.log("❌ Missing data");
      return NextResponse.json({ success: false, message: "Missing data" });
    }

    console.log("📦 BASE64 DATA:", data);

    // Decode data
    const decodedString = Buffer.from(data, "base64").toString();
    console.log("🔍 DECODED STRING:", decodedString);

    const decoded = JSON.parse(decodedString);
    console.log("🧩 PARSED DECODED DATA:", decoded);
    debugger;

    const {
      signature,
      signed_field_names,
      product_code,
      total_amount,
      transaction_uuid,
    } = decoded;

    console.log("📝 IMPORTANT FIELDS:", {
      signature,
      signed_field_names,
      product_code,
      total_amount,
      transaction_uuid,
    });

    if (!signature || !signed_field_names) {
      console.log("❌ Missing signature or fields");
      return NextResponse.json({
        success: false,
        message: "Invalid data from eSewa",
      });
    }

    const secret = process.env.ESEWA_SECRET_KEY;
    console.log("🔑 Using Secret Key:", secret ? "LOADED" : "MISSING");

    if (!secret) {
      return NextResponse.json({
        success: false,
        message: "Missing ESEWA_SECRET_KEY",
      });
    }

    // Generate signature
    const fields = signed_field_names.split(",");
    console.log("🧵 Signed Fields:", fields);

    const signString = fields
      .map((f: any) => `${f}=${decoded[f] ?? ""}`)
      .join(",");

    console.log("🔐 SIGN STRING:", signString);
    debugger;

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(signString)
      .digest("base64");

    console.log("🔑 GENERATED SIGNATURE:", generatedSignature);
    console.log("🔑 RECEIVED SIGNATURE:", signature);

    if (generatedSignature !== signature) {
      console.log("❌ Signature mismatch!");
      return NextResponse.json({
        success: false,
        message: "Invalid signature",
      });
    }

    // Extract ticket_id from transaction_uuid
    console.log("🔨 Parsing ticketId from transaction_uuid...");
    const ticketId = transaction_uuid.includes("__")
      ? transaction_uuid.split("__")[0]
      : null;

    console.log("🎫 Extracted Ticket ID:", ticketId);

    if (!ticketId) {
      console.log("❌ Invalid transaction_uuid format");
      return NextResponse.json({
        success: false,
        message: "Invalid transaction format",
      });
    }

    // Fetch payment
    console.log("🔍 Searching payment record for ticket:", ticketId);
    const payment = await prisma.payment.findFirst({
      where: { ticket_id: ticketId },
      include: {
        ticket: {
          include: {
            event: true,
            user: true,
            type: true,
          },
        },
      },
    });

    console.log("💾 PAYMENT RECORD FOUND:", payment);
    debugger;

    if (!payment) {
      console.log("❌ Payment not found in DB");
      return NextResponse.json({
        success: false,
        message: "Payment record not found",
      });
    }

    // Update payment
    console.log("✏️ Updating payment status to SUCCESS...");
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        payment_status: "SUCCESS",
        payment_date: new Date(),
        transaction_uuid,
        signature,
      },
    });

    console.log("💾 UPDATED PAYMENT:", updatedPayment);

    // Final response
    const response = {
      success: true,
      ticketId,
      transaction_uuid,
      amount: total_amount,
      eventTitle: payment.ticket?.event?.title,
      ticketType: payment.ticket?.type?.name ?? null,
      customerEmail: payment.ticket?.user?.email,
    };

    console.log("✅ FINAL RESPONSE:", response);
    return NextResponse.json(response);
  } catch (err: any) {
    console.log("💥 SERVER ERROR:", err);
    debugger;

    return NextResponse.json({
      success: false,
      message: err.message || "Server error",
    });
  }
}
