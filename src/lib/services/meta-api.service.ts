import { decrypt } from "@/lib/encryption";
import crypto from "crypto";

const META_API_VERSION = process.env.META_API_VERSION || "v18.0";

export class MetaAPIService {
  private baseUrl = `https://graph.facebook.com/${META_API_VERSION}`;

  async sendMessage(params: {
    phoneNumber: string;
    type: string;
    content: any;
  }) {
    // Placeholder for actual implementation
    // In a real app, you would retrieve the access token and phone number ID for the tenant
    // For now, we'll return a mock response
    console.log("Sending message via Meta API", params);
    
    return {
      messaging_product: "whatsapp",
      contacts: [{ input: params.phoneNumber, wa_id: params.phoneNumber }],
      messages: [{ id: `wamid_${Date.now()}` }],
    };
  }

  async sendTemplate(params: {
    phoneNumber: string;
    templateName: string;
    languageCode: string;
    components: any[];
  }) {
    // Placeholder
    console.log("Sending template via Meta API", params);

    return {
      messaging_product: "whatsapp",
      contacts: [{ input: params.phoneNumber, wa_id: params.phoneNumber }],
      messages: [{ id: `wamid_${Date.now()}` }],
    };
  }

  async createTemplate(params: any) {
     console.log("Creating template via Meta API", params);
     return { id: `template_${Date.now()}` };
  }

  async getTemplateStatus(metaId: string) {
    console.log("Getting template status via Meta API", metaId);
    return { status: "APPROVED" };
  }

  validateWebhookSignature(payload: any, signature: string, secret: string): boolean {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(JSON.stringify(payload)).digest("hex");
    const expectedSignature = `sha256=${digest}`;
    
    // Use timing safe comparison
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  isWithin24HourWindow(lastInboundTimestamp: Date): boolean {
    const now = new Date();
    const diff = now.getTime() - lastInboundTimestamp.getTime();
    const hours = diff / (1000 * 60 * 60);
    return hours < 24;
  }
}

export const metaAPI = new MetaAPIService();