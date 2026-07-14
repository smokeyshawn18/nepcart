import { clerkClient } from "@clerk/express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { parseRole } from "../lib/roles.js";

function getEmailFromClerkUser(clerkUser: any) {
  return (
    clerkUser.emailAddresses?.find(
      (item: any) => item.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress ??
    clerkUser.emailAddresses?.[0]?.emailAddress ??
    clerkUser.email_addresses?.find(
      (item: any) => item.id === clerkUser.primary_email_address_id,
    )?.email_address ??
    clerkUser.email_addresses?.[0]?.email_address ??
    ""
  );
}

function getDisplayNameFromClerkUser(clerkUser: any) {
  return (
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    [clerkUser.first_name, clerkUser.last_name].filter(Boolean).join(" ") ||
    clerkUser.username ||
    null
  );
}

export async function getLocalUser(clerkUserId: string) {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, clerkUserId))
    .limit(1);
  if (existingUser) {
    return existingUser;
  }

  const clerkUser = await clerkClient.users.getUser(clerkUserId);
  const email = getEmailFromClerkUser(clerkUser);
  const displayName = getDisplayNameFromClerkUser(clerkUser);
  const role = parseRole(
    clerkUser.publicMetadata?.role ?? clerkUser.publicMetadata?.role ?? "user",
  );

  await db
    .insert(users)
    .values({
      clerkUserId,
      email,
      displayName,
      role,
    })
    .onConflictDoUpdate({
      target: users.clerkUserId,
      set: { email, displayName, role, updatedAt: new Date() },
    });

  const [createdUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, clerkUserId))
    .limit(1);
  return createdUser ?? null;
}
