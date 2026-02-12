import { prisma } from "@/lib/prisma";

export type ThemeConfig = {
  mode: "light" | "dark" | "system";
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: "none" | "sm" | "md" | "lg" | "xl";
  fontFamily: string;
};

export class ThemeService {
  async getTenantTheme(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        name: true,
        logo: true,
        primaryColor: true,
        secondaryColor: true,
        theme: true,
      },
    });

    if (!tenant) {
      throw new Error("Tenant not found");
    }

    return {
      logo: tenant.logo,
      primaryColor: tenant.primaryColor || "#3B82F6",
      secondaryColor: tenant.secondaryColor || "#10B981",
      mode: (tenant.theme || "light") as "light" | "dark",
    };
  }

  async updateTenantTheme(tenantId: string, theme: Partial<ThemeConfig>) {
    return await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        primaryColor: theme.primaryColor,
        secondaryColor: theme.secondaryColor,
        theme: theme.mode,
      },
    });
  }

  async uploadLogo(tenantId: string, logoUrl: string) {
    return await prisma.tenant.update({
      where: { id: tenantId },
      data: { logo: logoUrl },
    });
  }

  generateCSSVariables(theme: ThemeConfig): string {
    return `
      :root {
        --primary: ${theme.primaryColor};
        --secondary: ${theme.secondaryColor};
        --accent: ${theme.accentColor};
        --background: ${theme.backgroundColor};
        --text: ${theme.textColor};
        --radius: ${theme.borderRadius};
        --font-family: ${theme.fontFamily};
      }
    `;
  }
}

export const themeService = new ThemeService();