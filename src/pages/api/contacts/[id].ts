import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth";
import { contactService } from "@/lib/services/contact.service";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await requireAuth();
    const { id } = req.query;

    if (req.method === "GET") {
      const contact = await contactService.getContactById(id as string);

      if (!contact || contact.tenantId !== session.tenantId) {
        return res.status(404).json({ error: "Contact not found" });
      }

      return res.status(200).json(contact);
    }

    if (req.method === "PUT") {
      const contact = await prisma.contact.findUnique({
        where: { id: id as string },
      });

      if (!contact || contact.tenantId !== session.tenantId) {
        return res.status(404).json({ error: "Contact not found" });
      }

      const updated = await contactService.updateContact(id as string, req.body);

      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      const contact = await prisma.contact.findUnique({
        where: { id: id as string },
      });

      if (!contact || contact.tenantId !== session.tenantId) {
        return res.status(404).json({ error: "Contact not found" });
      }

      await prisma.contact.delete({
        where: { id: id as string },
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return res.status(error.message === "Unauthorized" ? 401 : 500).json({ error: error.message });
  }
}