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
        optInStatus: data.optInStatus || "none",
        optInSource: data.optInSource,
        optInProof: data.optInProof,
      },
    });
  }

  async getContact(tenantId: string, contactId: string) {
    return await prisma.contact.findFirst({
      where: {
        id: contactId,
        tenantId,
      },
      include: {
        conversations: true,
        deals: true,
      },
    });
  }

  async updateContact(tenantId: string, contactId: string, data: any) {
    return await prisma.contact.update({
      where: {
        id: contactId,
      },
      data: {
        name: data.name,
        email: data.email,
        tags: data.tags,
        customFields: data.customFields,
        optInStatus: data.optInStatus,
        optInSource: data.optInSource,
        optInProof: data.optInProof,
      },
    });
  }

  async getContacts(params: {
    tenantId: string;
    search?: string;
    tags?: string[];
    optInStatus?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = { tenantId: params.tenantId };

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { phoneNumber: { contains: params.search } },
        { email: { contains: params.search, mode: "insensitive" } },
      ];
    }

    if (params.tags && params.tags.length > 0) {
      where.tags = { hasSome: params.tags };
    }

    if (params.optInStatus) {
      where.optInStatus = params.optInStatus;
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        take: params.limit || 50,
        skip: params.offset || 0,
        orderBy: { createdAt: "desc" },
      }),
      prisma.contact.count({ where }),
    ]);

    return { contacts, total };
  }

  async getContactById(contactId: string) {
    return prisma.contact.findUnique({
      where: { id: contactId },
      include: {
        conversations: {
          orderBy: { lastMessageAt: "desc" },
          take: 10,
        },
        deals: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async addTags(contactId: string, tags: string[]) {
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact) throw new Error("Contact not found");

    const updatedTags = Array.from(new Set([...contact.tags, ...tags]));

    return prisma.contact.update({
      where: { id: contactId },
      data: { tags: updatedTags },
    });
  }

  async removeTags(contactId: string, tags: string[]) {
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact) throw new Error("Contact not found");

    const updatedTags = contact.tags.filter((tag) => !tags.includes(tag));

    return prisma.contact.update({
      where: { id: contactId },
      data: { tags: updatedTags },
    });
  }

  async updateOptInStatus(params: {
    contactId: string;
    status: "pending" | "opted_in" | "opted_out";
    source?: string;
    proof?: string;
  }) {
    return prisma.contact.update({
      where: { id: params.contactId },
      data: {
        optInStatus: params.status,
        optInSource: params.source,
        optInProof: params.proof,
      },
    });
  }
}

export const contactService = new ContactService();