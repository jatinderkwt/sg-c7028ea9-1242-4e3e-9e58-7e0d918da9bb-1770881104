import { prisma } from "@/lib/prisma";

export class ContactService {
  async createContact(tenantId: string, data: any) {
    return await prisma.contact.create({
      data: {
        tenantId,
        phoneNumber: data.phoneNumber,
        name: data.name,
        email: data.email,
        tags: data.tags || [],
        customFields: data.customFields || {},
        optInStatus: data.optInStatus === "opted_in", // Convert string enum to boolean
        optInSource: data.optInSource,
        optInProof: data.optInProof,
      },
    });
  }

  async getContacts(tenantId: string, params: { page?: number; limit?: number; search?: string }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { phoneNumber: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.contact.count({ where }),
    ]);

    return { contacts, total, page, totalPages: Math.ceil(total / limit) };
  }

  async updateContact(tenantId: string, contactId: string, data: any) {
    return await prisma.contact.update({
      where: { id: contactId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async deleteContact(tenantId: string, contactId: string) {
    return await prisma.contact.delete({
      where: { id: contactId },
    });
  }
}

export const contactService = new ContactService();