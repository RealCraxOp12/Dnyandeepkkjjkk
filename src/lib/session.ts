import { cookies } from "next/headers";
import crypto from "crypto";

const SECRET_KEY = process.env.SESSION_SECRET || "fallback_secret_key_for_dev_only_12345";

export async function createParentSession(studentId: string) {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  const data = JSON.stringify({ studentId, expires: expires.toISOString() });
  
  // Create HMAC signature
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(data);
  const signature = hmac.digest("hex");
  
  const sessionToken = Buffer.from(`${data}::${signature}`).toString("base64");
  
  const cookieStore = await cookies();
  cookieStore.set("parent_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    path: "/",
  });
}

export async function getParentSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("parent_session")?.value;
  
  if (!sessionToken) return null;
  
  try {
    const decoded = Buffer.from(sessionToken, "base64").toString("utf-8");
    const [data, signature] = decoded.split("::");
    
    // Verify signature
    const hmac = crypto.createHmac("sha256", SECRET_KEY);
    hmac.update(data);
    const expectedSignature = hmac.digest("hex");
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    const parsed = JSON.parse(data);
    if (new Date(parsed.expires) < new Date()) {
      return null; // expired
    }
    
    return parsed.studentId;
  } catch (error) {
    return null;
  }
}

export async function destroyParentSession() {
  const cookieStore = await cookies();
  cookieStore.delete("parent_session");
}

export async function createStaffSession(staffId: string) {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  const data = JSON.stringify({ staffId, expires: expires.toISOString() });
  
  // Create HMAC signature
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(data);
  const signature = hmac.digest("hex");
  
  const sessionToken = Buffer.from(`${data}::${signature}`).toString("base64");
  
  const cookieStore = await cookies();
  cookieStore.set("staff_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    path: "/",
  });
}

export async function getStaffSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("staff_session")?.value;
  
  if (!sessionToken) return null;
  
  try {
    const decoded = Buffer.from(sessionToken, "base64").toString("utf-8");
    const [data, signature] = decoded.split("::");
    
    // Verify signature
    const hmac = crypto.createHmac("sha256", SECRET_KEY);
    hmac.update(data);
    const expectedSignature = hmac.digest("hex");
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    const parsed = JSON.parse(data);
    if (new Date(parsed.expires) < new Date()) {
      return null; // expired
    }
    
    return parsed.staffId;
  } catch (error) {
    return null;
  }
}

export async function destroyStaffSession() {
  const cookieStore = await cookies();
  cookieStore.delete("staff_session");
}
