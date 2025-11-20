import crypto from "crypto";

export function generateEsewaSignature(secretKey: string, total_amount: string, transaction_uuid: string, product_code: string) {
  const payload = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(payload)
    .digest("base64");

  return signature;
}
