import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { contactService } from "@/lib/services/contact.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth();

    if (req.method === "GET") {
      const { search, tags, optInStatus, limit, offset } = req.query;

      const result = await contactService.getContacts({
        tenantId: session.tenantId,
        search: search as string,
        tags: tags ? (tags as string).split(",") : undefined,
        optInStatus: optInStatus as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });

      return res.status(200).json(result);
    }

    if (req.method === "POST") {
      const { phoneNumber, name, email, tags, customFields, optInStatus, optInSource, optInProof } =
        req.body;

      if (!phoneNumber) {
        return res.status(400).json({ error: "Phone number is required" });
      }

      const contact = await contactService.createContact({
        tenantId: session.tenantId,
        phoneNumber,
        name,
        email,
        tags,
        customFields,
        optInStatus,
        optInSource,
        optInProof,
      });

      return res.status(201).json(contact);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("Contacts API error:", error);
    return res.status(error.message === "Unauthorized" ? 401 : 500).json({ error: error.message });
  }
}