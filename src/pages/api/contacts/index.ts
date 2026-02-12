import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { contactService } from "@/lib/services/contact.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "GET") {
      const { search, tags, optInStatus, limit, offset } = req.query;
      
      const result = await contactService.getContacts({
        tenantId: session.tenantId,
        search: search as string,
        tags: tags ? (tags as string).split(",") : undefined,
        optInStatus: optInStatus as string,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });

      return res.status(200).json(result);
    }

    if (req.method === "POST") {
      const contact = await contactService.createContact(session.tenantId, req.body);
      return res.status(201).json(contact);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(error.message === "Unauthorized" ? 401 : 500).json({ error: error.message });
  }
}