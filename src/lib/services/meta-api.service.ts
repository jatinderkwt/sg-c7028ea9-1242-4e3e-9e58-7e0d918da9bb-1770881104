import { decrypt } from "@/lib/encryption";
import crypto from "crypto";

const META_API_VERSION = process.env.META_API_VERSION || "v21.0";
const META_GRAPH_API_URL = process.env.META_GRAPH_API_URL || "https://graph.facebook.com";

export interface SendMessageParams {
  phoneNumberId: string;
  accessToken: string;
  to: string;
  type: "text" | "template" | "image" | "audio" | "video" | "document";
  content?: string;
  templateName?: string;
  templateLanguage?: string;
  templateParams?: string[];
  mediaUrl?: string;
}

export interface WebhookMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
  image?: { id: string; mime_type: string; sha256: string };
  audio?: { id: string; mime_type: string; sha256: string };
  video?: { id: string; mime_type: string; sha256: string };
  document?: { id: string; mime_type: string; sha256: string; filename: string };
}

export interface WebhookStatus {
  id: string;
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: string;
  recipient_id: string;
  errors?: Array<{ code: number; title: string }>;
}

export class MetaAPIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${META_GRAPH_API_URL}/${META_API_VERSION}`;
  }

  async sendMessage(params: SendMessageParams): Promise<{ messageId: string }> {
    const decryptedToken = decrypt(params.accessToken);
    
    const body: any = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: params.to,
    };

    if (params.type === "text") {
      body.type = "text";
      body.text = { body: params.content };
    } else if (params.type === "template") {
      body.type = "template";
      body.template = {
        name: params.templateName,
        language: { code: params.templateLanguage || "en" },
        components: params.templateParams
          ? [
              {
                type: "body",
                parameters: params.templateParams.map((p) => ({ type: "text", text: p })),
              },
            ]
          : [],
      };
    } else {
      body.type = params.type;
      body[params.type] = { link: params.mediaUrl };
    }

    const response = await fetch(`${this.baseUrl}/${params.phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${decryptedToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Meta API Error: ${error.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    return { messageId: data.messages[0].id };
  }

  async createTemplate(params: {
    businessAccountId: string;
    accessToken: string;
    name: string;
    category: string;
    language: string;
    components: any[];
  }): Promise<{ templateId: string }> {
    const decryptedToken = decrypt(params.accessToken);

    const response = await fetch(
      `${this.baseUrl}/${params.businessAccountId}/message_templates`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${decryptedToken}`,
        },
        body: JSON.stringify({
          name: params.name,
          category: params.category,
          language: params.language,
          components: params.components,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Meta API Error: ${error.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    return { templateId: data.id };
  }

  async getTemplateStatus(params: {
    businessAccountId: string;
    accessToken: string;
    templateName: string;
  }): Promise<{ status: string; rejectionReason?: string }> {
    const decryptedToken = decrypt(params.accessToken);

    const response = await fetch(
      `${this.baseUrl}/${params.businessAccountId}/message_templates?name=${params.templateName}`,
      {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Meta API Error: ${error.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    const template = data.data[0];

    return {
      status: template.status,
      rejectionReason: template.rejected_reason,
    };
  }

  async validateWebhookSignature(payload: string, signature: string, appSecret: string): Promise<boolean> {
    const expectedSignature = crypto
      .createHmac("sha256", appSecret)
      .update(payload)
      .digest("hex");

    return `sha256=${expectedSignature}` === signature;
  }

  isWithin24HourWindow(lastInboundTimestamp: Date): boolean {
    const now = new Date();
    const diff = now.getTime() - lastInboundTimestamp.getTime();
    const hours = diff / (1000 * 60 * 60);
    return hours < 24;
  }

  calculateSessionExpiry(lastInboundTimestamp: Date): Date {
    const expiry = new Date(lastInboundTimestamp);
    expiry.setHours(expiry.getHours() + 24);
    return expiry;
  }
}

export const metaAPI = new MetaAPIService();