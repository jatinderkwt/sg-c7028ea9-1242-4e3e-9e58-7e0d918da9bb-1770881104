import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";

export interface Session {
  userId: string;
  tenantId: string;
  role: string;
}

export async function getSession(req: NextApiRequest): Promise<Session> {
  const token = req.cookies["auth-token"];

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as Session;
    return decoded;
  } catch (error) {
    throw new Error("Unauthorized");
  }
}

export async function requireAuth(req: NextApiRequest): Promise<Session> {
  return getSession(req);
}

export async function requireRole(allowedRoles: string[], session: Session): Promise<void> {
  if (!allowedRoles.includes(session.role)) {
    throw new Error("Forbidden");
  }
}