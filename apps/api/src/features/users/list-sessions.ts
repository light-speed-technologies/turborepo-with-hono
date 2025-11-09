import { protectedProcedure } from "../../trpc";
import { database } from "../../db";
import { z } from "zod";

// Schema for listing user sessions
const listSessionsSchema = z.object({
  userId: z.string(),
});

export const listSessions = protectedProcedure
  .input(listSessionsSchema)
  .query(async ({ input }) => {
    // Fetch all sessions for the user
    const sessions = await database.session.findMany({
      where: { userId: input.userId },
      orderBy: { createdAt: "desc" },
    });

    // Return sessions with formatted data
    return sessions.map((session) => ({
      id: session.id,
      token: session.token,
      expiresAt: session.expiresAt,
      ipAddress: session.ipAddress ?? null,
      userAgent: session.userAgent ?? null,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }));
  });
