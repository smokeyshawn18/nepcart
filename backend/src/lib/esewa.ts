import crypto from "crypto";

export function generateEsewaSignature(
  message: string,
  secretKey: string,
): string {
  return crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");
}

function buildSignedMessage(
  fields: Record<string, string>,
  signedFieldNames: string,
): string {
  return signedFieldNames
    .split(",")
    .map((key) => `${key}=${fields[key]}`)
    .join(",");
}

export function verifyEsewaSignature(
  fields: Record<string, string>,
  signedFieldNames: string,
  secretKey: string,
  signature: string,
): boolean {
  const message = buildSignedMessage(fields, signedFieldNames);
  const expected = generateEsewaSignature(message, secretKey);

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export interface EsewaCallbackPayload {
  transaction_code: string;
  status:
    | "COMPLETE"
    | "PENDING"
    | "FULL_REFUND"
    | "PARTIAL_REFUND"
    | "AMBIGUOUS"
    | "NOT_FOUND"
    | "CANCELED";
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  signed_field_names: string;
  signature: string;
}

export function decodeEsewaResponse(data: string): EsewaCallbackPayload {
  const json = Buffer.from(data, "base64").toString("utf-8");
  return JSON.parse(json);
}

export async function checkEsewaStatus(params: {
  statusCheckUrl: string;
  productCode: string;
  totalAmount: string | number;
  transactionUuid: string;
}) {
  const url = new URL(params.statusCheckUrl);
  url.searchParams.set("product_code", params.productCode);
  url.searchParams.set("total_amount", String(params.totalAmount));
  url.searchParams.set("transaction_uuid", params.transactionUuid);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`eSewa status check failed: ${res.status}`);

  return res.json() as Promise<{
    product_code: string;
    transaction_uuid: string;
    total_amount: number;
    status:
      | "COMPLETE"
      | "PENDING"
      | "FULL_REFUND"
      | "PARTIAL_REFUND"
      | "AMBIGUOUS"
      | "NOT_FOUND"
      | "CANCELED";
    ref_id: string;
  }>;
}
