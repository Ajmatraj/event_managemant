import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

function generateEsewaSignature(secretKey: string, message: string) {
  return crypto.createHmac("sha256", secretKey).update(message).digest("base64");
}

export async function POST(req: Request) {
  try {
    const { amount, ticketId, userId } = await req.json();

    // ---- Validate Inputs ----
    if (!amount || !ticketId || !userId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ---- Validate Ticket Exists ----
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    // ---- Esewa Sandbox Key ----
    const secretKey = "8gBm/:&EnhH.1/q"; // TEST KEY ONLY
    const product_code = "EPAYTEST"; // MUST be EPAYTEST in sandbox

    const total_amount = Number(amount);
    const transaction_uuid = Date.now().toString();

    // ---- Signature ----
    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const signature = generateEsewaSignature(secretKey, message);

    // ---- Check Payment Record ----
    const existingPayment = await prisma.payment.findUnique({
      where: { ticket_id: ticketId },
    });

    let payment;

    if (existingPayment) {
      // Update existing pending payment
      payment = await prisma.payment.update({
        where: { ticket_id: ticketId },
        data: {
          amount: total_amount,
          payment_method: "ESEWA",
          payment_status: "PENDING",
          transaction_uuid,
          signature,
        },
      });
    } else {
      // Create new
      payment = await prisma.payment.create({
        data: {
          ticket_id: ticketId,
          user_id: userId,
          amount: total_amount,
          payment_method: "ESEWA",
          payment_status: "PENDING",
          transaction_uuid,
          signature,
        },
      });
    }

    return NextResponse.json({
      gatewayUrl: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
      paymentId: payment.id,
      payload: {
        amount: String(amount),
        tax_amount: "0",
        total_amount: String(total_amount),

        transaction_uuid,
        product_code,

        product_service_charge: "0",
        product_delivery_charge: "0",

        success_url: "http://localhost:3000/api/payment/esewa/success",
        failure_url: "http://localhost:3000/api/payment/esewa/failure",

        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
