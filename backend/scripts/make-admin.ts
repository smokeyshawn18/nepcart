import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { users } from "../src/db/schema";

async function makeAdmin() {
  await db
    .update(users)
    .set({
      role: "admin",
      updatedAt: new Date(),
    })
    .where(eq(users.email, "slukky21@gmail.com"));

  console.log("User is now admin");
  process.exit(0);
}

makeAdmin();
