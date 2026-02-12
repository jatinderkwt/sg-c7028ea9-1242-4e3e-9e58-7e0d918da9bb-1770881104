import { prisma } from "@/lib/prisma";

export class ContactService {
  async createContact(params: {
    tenantId: string;
    phoneNumber: string;
    name?: string;
    email?: string;
    tags?: string[];
    customFields?: any;
    optInStatus?: string;
    optInSource?: string;
    optInProof?: string;
  }) {
    return prisma.contact.create({
      data: {
        tenantId: params.tenantId,
        phoneNumber: params.phoneNumber,
        name: params.name,
        email: params.email,
        tags: params.tags || [],
        customFields: params.customFields || {},
        optInStatus: params.optInStatus || "pending",
        optInSource: params.optInSource,
        optInProof: params.optInProof,
        optInTimestamp: params.optInStatus === "opted_in" ? new Date() : undefined,
      },
    });
  }

  async updateContact(contactId: string, data: any) {
    return prisma.contact.update({
      where: { id: contactId },
      data,
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
        tasks: {
          where: { status: "pending" },
          orderBy: { dueDate: "asc" },
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
        optInTimestamp: params.status === "opted_in" ? new Date() : undefined,
      },
    });
  }
}

export const contactService = new ContactService();