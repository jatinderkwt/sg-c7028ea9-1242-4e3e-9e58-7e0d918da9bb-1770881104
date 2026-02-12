import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { contactService } from "@/lib/services/contact.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth(req);

    if (req.method === "GET") {
      const { page, limit, search } = req.query;
      
      const result = await contactService.getContacts(session.tenantId, {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
        search: search as string,
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