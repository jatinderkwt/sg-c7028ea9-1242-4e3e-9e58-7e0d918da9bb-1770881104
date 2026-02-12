import { prisma } from "@/lib/prisma";

export type ThemeConfig = {
  mode: "light" | "dark";
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: string;
};

export class ThemeService {
  async getTheme(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        name: true,
        settings: true,
      },
    });

    if (!tenant) throw new Error("Tenant not found");

    const settings = tenant.settings as Record<string, any> || {};

    return {
      name: tenant.name,
      logo: settings.logo || null,
      theme: {
        mode: settings.themeMode || "light",
        primaryColor: settings.primaryColor || "#000000",
        secondaryColor: settings.secondaryColor || "#ffffff",
        fontFamily: settings.fontFamily || "Inter",
        borderRadius: settings.borderRadius || "0.5rem",
      },
    };
  }

  async updateTheme(tenantId: string, data: Partial<ThemeConfig> & { logo?: string }) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { settings: true },
    });

    if (!tenant) throw new Error("Tenant not found");

    const currentSettings = (tenant.settings as Record<string, any>) || {};

    const updatedSettings = {
      ...currentSettings,
      ...(data.mode && { themeMode: data.mode }),
      ...(data.primaryColor && { primaryColor: data.primaryColor }),
      ...(data.secondaryColor && { secondaryColor: data.secondaryColor }),
      ...(data.fontFamily && { fontFamily: data.fontFamily }),
      ...(data.borderRadius && { borderRadius: data.borderRadius }),
      ...(data.logo && { logo: data.logo }),
    };

    return await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        settings: updatedSettings,
      },
    });
  }

  generateCssVariables(theme: ThemeConfig) {
    return `
      :root {
        --primary: ${theme.primaryColor};
        --secondary: ${theme.secondaryColor};
        --radius: ${theme.borderRadius};
        --font-sans: ${theme.fontFamily};
      }
    `;
  }
}

export const themeService = new ThemeService();