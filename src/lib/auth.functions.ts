import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const codeSchema = z.object({ code: z.string().trim().min(1).max(100) });

/**
 * Exchanges the shared admin code for the `admin` role on the signed-in account.
 */
export const claimAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => codeSchema.parse(input))
  .handler(async ({ data, context }) => {
    const expected = process.env["ADMIN_SIGNUP_CODE"];
    if (!expected) return { ok: false as const, error: "Admin access is not configured." };
    if (data.code !== expected) return { ok: false as const, error: "Invalid admin code." };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: context.userId, role: "admin" }, { onConflict: "user_id,role" });

    if (error) return { ok: false as const, error: "Could not grant admin access." };
    return { ok: true as const };
  });
