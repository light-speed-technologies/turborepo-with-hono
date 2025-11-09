import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { database } from "../db";
import { nextCookies } from "better-auth/next-js";
import { customSession, admin } from "better-auth/plugins";

// Extract domain from URL (remove protocol and port)
// Cookie domains must be just the domain/IP, not full URLs
function extractDomain(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const urlObj = new URL(url);
    return urlObj.hostname; // Returns domain/IP without port
  } catch {
    return undefined;
  }
}

// Determine cookie domain for cross-origin scenarios
function getCookieDomain(
  serverUrl: string,
  dashboardUrl: string
): string | undefined {
  const serverDomain = extractDomain(serverUrl);
  const dashboardDomain = extractDomain(dashboardUrl);

  // For cross-origin (different domains), don't set domain attribute
  // This allows SameSite=None cookies to work properly
  if (serverDomain && dashboardDomain && serverDomain !== dashboardDomain) {
    return undefined; // Let it default to server domain
  }

  // Same domain: use server domain
  return serverDomain;
}

const serverUrl =
  process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || "";
const dashboardUrl =
  process.env.DASHBOARD_URL || process.env.NEXT_PUBLIC_APP_URL || "";

const cookieDomain = getCookieDomain(serverUrl, dashboardUrl);

const options = {
  baseURL: serverUrl,
  database: prismaAdapter(database, {
    provider: "postgresql",
  }),
  trustedOrigins: [serverUrl, dashboardUrl].filter(Boolean),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  user: {
    additionalFields: {
      // Add role field to user model
      role: {
        type: "string",
        required: false,
        input: false,
        defaultValue: "user",
      },
      // Add banned field to user model
      banned: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      // Add ban reason field to user model
      banReason: {
        type: "string",
        required: false,
        input: false,
      },
      // Add ban expiration field to user model
      banExpires: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },
  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false, // true for HTTPS, false for HTTP
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" requires HTTPS
      partitioned: process.env.NODE_ENV === "production" ? true : false, // Partitioned requires HTTPS
      domain: process.env.NODE_ENV === "production" ? cookieDomain : undefined,
    },
  },
  plugins: [nextCookies()],
} satisfies BetterAuthOptions;

// Better Auth instance
export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    // Customize session response to include role, approved, and ban fields
    customSession(async ({ user, session }) => {
      // Check if user is banned
      if (user.banned) {
        // Check if ban has expired
        if (user.banExpires && new Date(user.banExpires) < new Date()) {
          // Ban has expired, unban the user
          await database.user.update({
            where: { id: user.id },
            data: {
              banned: false,
              banReason: null,
              banExpires: null,
            },
          });
        } else {
          // User is still banned, throw error
          throw new Error(
            user.banReason ||
              "Your account has been banned. Please contact support."
          );
        }
      }

      return {
        user: {
          ...user,
          role: user.role,
          banned: user.banned,
          banReason: user.banReason,
          banExpires: user.banExpires,
        },
        session,
      };
    }, options),
    // Admin plugin with custom role check
    admin({
      // Configure admin to use uppercase roles to match Prisma enum
      adminRoles: ["admin"],
      defaultRole: "user",
    }),
  ],
});

export type Auth = typeof auth;
